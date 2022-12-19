import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { Repository } from 'typeorm';
import { Member } from '../../entites/Member';
import { JwtService } from '@nestjs/jwt';

const bcrypt = require('bcrypt');

@Injectable()
export class AuthService {
  constructor(@InjectRepository(Member) private memberRepository: Repository<Member>, private jwtService: JwtService) {}

  async validateUser(email: string, password: string) {
    const member = await this.memberRepository.findOne({
      where: { email },
      select: ['seq', 'email', 'password']
    });
    if (!member) {
      return null;
    }
    const result = await bcrypt.compare(password, member.password);

    if (result) {
      const { password, ...userWithoutPassword } = member;
      console.log(userWithoutPassword);
      return userWithoutPassword;
    }
    return null;
  }

  async login(member: any) {
    const payload = { email: member.email, seq: member.seq };
    return {
      accessToken: this.jwtService.sign(payload)
    };
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
