import { CACHE_MANAGER, Inject, Injectable, InternalServerErrorException } from '@nestjs/common';
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
    const accessToken = this.jwtService.sign(payload, { expiresIn: '10m' });
    const refreshToken = this.jwtService.sign(payload, { expiresIn: '30d', secret: 'MOVERLAB_REFRESH' });
    await this.cacheManager.set(member.email, refreshToken, 0);

    return { accessToken, refreshToken };
  }

  async refresh(token: string) {
    let decodedToken;
    try {
      decodedToken = this.jwtService.decode(token);
    } catch (e) {
      throw new InternalServerErrorException('서버에서 에러가 발생하였습니다.');
    }
    const member = await this.memberRepository.findOne({
      where: { seq: decodedToken.seq },
      select: ['seq', 'email']
    });
    const payload = { member };
    return {
      accessToken: this.jwtService.sign(payload, { expiresIn: '10m' })
    };
  }
}
