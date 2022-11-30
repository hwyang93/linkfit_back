import { Injectable } from '@nestjs/common';
import { PassportSerializer } from '@nestjs/passport';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AuthService } from './auth.service';
import { Member } from '../entites/Member';

@Injectable()
export class LocalSerializer extends PassportSerializer {
  constructor(private readonly authService: AuthService, @InjectRepository(Member) private memberRepository: Repository<Member>) {
    super();
  }

  serializeUser(member: Member, done: CallableFunction) {
    console.log(member);
    done(null, member.seq);
  }

  async deserializeUser(seq: number, done: CallableFunction) {
    return await this.memberRepository
      .findOneOrFail({
        where: { seq: +seq },
        select: ['seq', 'email', 'nickname']
      })
      .then(member => {
        console.log('member', member);
        done(null, member);
      })
      .catch(error => done(error));
  }
}
