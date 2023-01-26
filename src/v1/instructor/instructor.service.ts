import { Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Member } from '../../entites/Member';
import { Repository } from 'typeorm';
import * as dayjs from 'dayjs';
import { CreateInstructorSuggestDto } from './dto/create-instructor-suggest.dto';
import { PositionSuggest } from '../../entites/PositionSuggest';
import { MemberFavorite } from '../../entites/MemberFavorite';

@Injectable()
export class InstructorService {
  constructor(
    @InjectRepository(Member) private memberRepository: Repository<Member>,
    @InjectRepository(PositionSuggest) private positionSuggestRepository: Repository<PositionSuggest>,
    @InjectRepository(MemberFavorite) private memberFavoriteRepository: Repository<MemberFavorite>
  ) {}

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
      .leftJoinAndSelect('member.regionAuth', 'regionAuth')
      .leftJoinAndSelect('member.resumes', 'resumes')
      .leftJoinAndSelect('resumes.careers', 'careers')
      .select(['member.seq', 'member.name', 'member.nickname', 'member.field', 'regionAuth.address', 'resumes', 'careers'])
      .getMany();

    const result = [];
    instructors.forEach(item => {
      const career = this.calcCareer(item.resumes[0].careers);
      result.push({ seq: item.seq, name: item.name, nickname: item.nickname, field: item.field, address: item.regionAuth.address, career: career });
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

    const { follower } = await this.memberFavoriteRepository
      .createQueryBuilder('memberFavorite')
      .select('COUNT(*)', 'follower')
      .where('memberFavorite.favoriteSeq = :favoriteSeq', { favoriteSeq: seq })
      .getRawOne();

    const career = this.calcCareer(instructor.resumes[0].careers);
    return {
      seq: instructor.seq,
      name: instructor.name,
      nickname: instructor.nickname,
      address: instructor.regionAuth.address,
      career: career,
      links: instructor.links,
      follower: follower
    };
  }

  async createInstructorSuggest(createInstructorSuggestDto: CreateInstructorSuggestDto, member: Member) {
    const positionSuggest = createInstructorSuggestDto.toEntity();
    positionSuggest.writerSeq = member.seq;
    positionSuggest.suggestMemberSeq = member.seq;
    positionSuggest.status = 'WAITING';

    const savedPositionSuggest = await this.positionSuggestRepository.save(positionSuggest);

    return { seq: savedPositionSuggest.seq };
  }

  async createInstructorFollow(seq: number, member: Member) {
    const memberFavorite = new MemberFavorite();
    memberFavorite.memberSeq = member.seq;
    memberFavorite.favoriteSeq = seq;

    const checkInstructorFollow = await this.memberFavoriteRepository
      .createQueryBuilder('memberFavorite')
      .where('memberFavorite.memberSeq = :memberSeq', { memberSeq: member.seq })
      .andWhere('memberFavorite.favoriteSeq = :favoriteSeq', { favoriteSeq: seq })
      .withDeleted()
      .getOne();

    let savedSeq;

    if (!checkInstructorFollow) {
      const { seq } = await this.memberFavoriteRepository.save(memberFavorite);
      savedSeq = seq;
    } else {
      await this.memberFavoriteRepository
        .createQueryBuilder('memberFavorite')
        .restore()
        .where('memberSeq = :memberSeq', { memberSeq: member.seq })
        .andWhere('favoriteSeq = :favoriteSeq', { favoriteSeq: seq })
        .execute();

      savedSeq = checkInstructorFollow.seq;
    }
    return { seq: savedSeq };
  }

  async deleteInstructorFollow(seq: number, member: Member) {
    const instructorFollow = await this.memberFavoriteRepository.createQueryBuilder('memberFavorite').where({ seq }).getOne();
    if (instructorFollow.memberSeq !== member.seq) {
      throw new UnauthorizedException('허용되지 않은 접근입니다.');
    }
    await this.memberFavoriteRepository.createQueryBuilder('memberFavorite').softDelete().where({ seq }).execute();
    return { seq };
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
