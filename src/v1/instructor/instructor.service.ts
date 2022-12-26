import { Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Member } from '../../entites/Member';
import { Repository } from 'typeorm';

@Injectable()
export class InstructorService {
  constructor(@InjectRepository(Member) private memberRepository: Repository<Member>) {}

  async getInstructorList(member: Member) {
    const memberInfo = await this.memberRepository.createQueryBuilder('member').where('member.seq = :seq', { seq: member.seq }).innerJoinAndSelect('member.regionAuth', 'regionAuth').getOne();
    if (!memberInfo.regionAuth) {
      throw new UnauthorizedException('지역 인증이 필요합니다.');
    }
    console.log(memberInfo.regionAuth);

    return `This action returns all instructor`;
  }
}
