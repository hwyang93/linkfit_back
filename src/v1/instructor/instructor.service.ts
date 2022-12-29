import { Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Member } from '../../entites/Member';
import { Repository } from 'typeorm';
import * as dayjs from 'dayjs';

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
      .andWhere('resumes.isMaster = :isMaster', { isMaster: 'Y' })
      .innerJoinAndSelect('member.regionAuth', 'regionAuth')
      .innerJoinAndSelect('member.resumes', 'resumes')
      .innerJoinAndSelect('resumes.careers', 'careers')
      .select(['member.seq', 'member.name', 'member.nickname', 'member.field', 'regionAuth.address', 'resumes', 'careers'])
      .getMany();

    const result = [];
    instructors.forEach(item => {
      const career = this.calcCareer(item.resumes[0].careers);
      result.push({ seq: item.seq, name: item.name, nickname: item.nickname, address: item.regionAuth.address, career: career });
    });
    return result;
  }

  async getInstructor(seq: number) {
    const instructor = await this.memberRepository
      .createQueryBuilder('member')
      .where('member.seq = :seq', { seq: seq })
      .andWhere('resumes.isMaster = :isMaster', { isMaster: 'Y' })
      .leftJoinAndSelect('member.regionAuth', 'regionAuth')
      .leftJoinAndSelect('member.resumes', 'resumes')
      .leftJoinAndSelect('member.links', 'links')
      .leftJoinAndSelect('resumes.careers', 'careers')
      .select(['member.seq', 'member.name', 'member.nickname', 'member.field', 'regionAuth.address', 'resumes', 'careers', 'links'])
      .getOne();
    const career = this.calcCareer(instructor.resumes[0].careers);
    return {
      seq: instructor.seq,
      name: instructor.name,
      nickname: instructor.nickname,
      address: instructor.regionAuth.address,
      career: career,
      links: instructor.links
    };
  }

  calcCareer(careers: any) {
    let totalDay = 0;
    let career;
    careers.forEach(item => {
      const startDate = dayjs(new Date(item.startDate));
      const endDate = dayjs(new Date(item.endDate));
      const diffDay = endDate.diff(startDate, 'month', true);
      totalDay += diffDay;
    });

    if (totalDay === 0) {
      career = '경력 없음';
    } else {
      career = (totalDay / 12 + 1).toFixed(0) + '년차';
    }
    return career;
  }
}
