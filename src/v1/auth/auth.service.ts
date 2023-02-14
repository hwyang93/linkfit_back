import { CACHE_MANAGER, Inject, Injectable, InternalServerErrorException, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { Repository } from 'typeorm';
import { Member } from '../../entites/Member';
import { JwtService } from '@nestjs/jwt';
import { Cache } from 'cache-manager';

const bcrypt = require('bcrypt');

@Injectable()
export class AuthService {
  constructor(@Inject(CACHE_MANAGER) private cacheManager: Cache, @InjectRepository(Member) private memberRepository: Repository<Member>, private jwtService: JwtService) {}

  async validateUser(email: string, password: string) {
    const member = await this.memberRepository.createQueryBuilder('member').select().addSelect('member.password').where({ email }).getOne();

    if (!member) {
      return null;
    }
    const result = await bcrypt.compare(password, member.password);

    if (result) {
      const { ...userWithoutPassword } = member;
      await this.memberRepository.createQueryBuilder('member').update().set({ lastLogin: new Date() }).where({ seq: member.seq }).execute();

      return userWithoutPassword;
    }
    return null;
  }

  async login(member: any) {
    const payload = { email: member.email, seq: member.seq };
    const accessToken = this.jwtService.sign(payload, { expiresIn: '1m', secret: process.env.JWT_PRIVATE_KEY });

    const refreshToken = this.jwtService.sign(payload, { expiresIn: '30d', secret: process.env.JWT_PUBLIC_KEY });
    await this.cacheManager.set(member.email, refreshToken, 0);

    return { accessToken, refreshToken };
  }

  async refresh(token: string, member: Member) {
    const cachedRefreshToken = (await this.cacheManager.get(member.email))?.toString();
    console.log('cachedRefreshToken::::', cachedRefreshToken);
    let decodedToken;
    try {
      decodedToken = this.jwtService.verify(cachedRefreshToken, { secret: process.env.JWT_PUBLIC_KEY });
    } catch (e) {
      throw new UnauthorizedException('만료된 리프레시 토큰입니다.');
    }
    const memberInfo = await this.memberRepository.findOne({
      where: { seq: decodedToken.seq },
      select: ['seq', 'email']
    });
    const payload = { seq: memberInfo.seq, email: member.email };
    return {
      accessToken: this.jwtService.sign(payload, { expiresIn: '1m', secret: process.env.JWT_PRIVATE_KEY })
    };
  }
}
