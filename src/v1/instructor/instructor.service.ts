import { Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Member } from '../../entites/Member';
import { Repository } from 'typeorm';
import { RegionAuth } from '../../entites/RegionAuth';

@Injectable()
export class InstructorService {
  constructor(@InjectRepository(Member) private memberRepository: Repository<Member>) {}

  async getInstructorList(member: Member) {
    const { regionAuth } = await this.memberRepository.createQueryBuilder('member').where('member.seq = :seq', { seq: member.seq }).leftJoinAndSelect('member.regionAuth', 'regionAuth').getOne();
    if (!regionAuth) {
      throw new UnauthorizedException('지역 인증이 필요합니다.');
    }

    const instructors = await this.memberRepository
      .createQueryBuilder('member')
      .where('member.type = :type', { type: 'INSTRUCTOR' })
      .andWhere('member.isOpenProfile = :isOpenProfile', { isOpenProfile: 'Y' })
      .andWhere('regionAuth.address = :address', { address: regionAuth.address })
      .innerJoinAndSelect('member.regionAuth', 'regionAuth')
      .select(['member.name', 'member.nickname', 'regionAuth.address'])
      .getMany();
    const result = [];
    instructors.forEach((item, idx) => {
      result.push({ ...item, career: idx });
    });
    return result;
  }
}
