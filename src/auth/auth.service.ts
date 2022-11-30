import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import bcrypt from 'bcrypt';
import { Repository } from 'typeorm';
import { Member } from '../entites/Member';

@Injectable()
export class AuthService {
  constructor(@InjectRepository(Member) private memberRepository: Repository<Member>) {}

  async validateUser(email: string, password: string) {
    const member = await this.memberRepository.findOne({
      where: { email },
      select: ['seq', 'email', 'password']
    });
    console.log(email, password, member);
    if (!member) {
      return null;
    }
    const result = await bcrypt.compare(password, member.password);
    if (result) {
      const { password, ...userWithoutPassword } = member;
      return userWithoutPassword;
    }
    return null;
  }
}
