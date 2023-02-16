import { Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Member } from '../../entites/Member';
import { Repository } from 'typeorm';
import { CreateInstructorSuggestDto } from './dto/create-instructor-suggest.dto';
import { PositionSuggest } from '../../entites/PositionSuggest';
import { MemberFavorite } from '../../entites/MemberFavorite';
import { MemberReputation } from '../../entites/MemberReputation';
import { calcCareer } from '../../common/utils/utils';

@Injectable()
export class InstructorService {
  constructor(
    @InjectRepository(Member) private memberRepository: Repository<Member>,
    @InjectRepository(PositionSuggest) private positionSuggestRepository: Repository<PositionSuggest>,
    @InjectRepository(MemberFavorite) private memberFavoriteRepository: Repository<MemberFavorite>,
    @InjectRepository(MemberReputation) private memberReputationRepository: Repository<MemberReputation>
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
      .andWhere('regionAuth.region2depth = :region2depth', { region2depth: regionAuth.region2depth })
      .andWhere('resumes.isMaster = :isMaster', { isMaster: 'Y' })
      .leftJoinAndSelect('member.regionAuth', 'regionAuth')
      .leftJoinAndSelect('member.resumes', 'resumes')
      .leftJoinAndSelect('resumes.careers', 'careers')
      .leftJoinAndSelect(
        sq => {
          return sq
            .select('memberFavorite.favoriteSeq', 'favoriteSeq')
            .addSelect('COUNT(memberFavorite.favoriteSeq)', 'followerCount')
            .from(MemberFavorite, 'memberFavorite')
            .groupBy('memberFavorite.favoriteSeq');
        },
        'follower',
        'member.seq = follower.favoriteSeq'
      )
      .select(['member.seq', 'member.name', 'member.nickname', 'member.field', 'regionAuth.region1depth', 'regionAuth.region2depth', 'regionAuth.region3depth', 'resumes', 'careers'])
      .addSelect('IFNULL(follower.followerCount, 0)', 'followerCount')
      .orderBy('member.updatedAt', 'DESC')
      .getRawAndEntities();

    const follower = await this.memberFavoriteRepository.createQueryBuilder('memberFavorite').where('memberFavorite.memberSeq = :memberSeq', { memberSeq: member.seq }).getMany();

    const result = [];
    instructors.entities.forEach(item => {
      const career = calcCareer(item.resumes[0].careers);
      result.push({
        seq: item.seq,
        name: item.name,
        nickname: item.nickname,
        field: item.field,
        address: `${item.regionAuth.region1depth} ${item.regionAuth.region2depth} ${item.regionAuth.region3depth}`,
        career: career,
        followerCount: parseInt(
          instructors.raw.find(raw => {
            return raw.member_SEQ === item.seq;
          })?.followerCount
        ),
        isFollow: follower.find(follower => {
          return follower.favoriteSeq === item.seq;
        })
          ? 'Y'
          : 'N'
      });
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
      .select([
        'member.seq',
        'member.name',
        'member.nickname',
        'member.field',
        'member.intro',
        'regionAuth.region1depth',
        'regionAuth.region2depth',
        'regionAuth.region3depth',
        'resumes',
        'careers',
        'links'
      ])
      .getOne();

    const { follower } = await this.memberFavoriteRepository
      .createQueryBuilder('memberFavorite')
      .select('COUNT(*)', 'follower')
      .where('memberFavorite.favoriteSeq = :favoriteSeq', { favoriteSeq: seq })
      .getRawOne();

    const reputations = await this.memberReputationRepository
      .createQueryBuilder('memberReputation')
      .leftJoinAndSelect('memberReputation.evaluationMember', 'evaluationMember')
      .where('memberReputation.targetMemberSeq = :memberSeq', { memberSeq: seq })
      .orderBy('memberReputation.updatedAt', 'DESC')
      .getMany();

    const career = calcCareer(instructor.resumes[0].careers);
    return {
      seq: instructor.seq,
      name: instructor.name,
      nickname: instructor.nickname,
      address: `${instructor.regionAuth.region1depth} ${instructor.regionAuth.region2depth} ${instructor.regionAuth.region3depth}`,
      intro: instructor.intro,
      career: career,
      links: instructor.links,
      follower: follower,
      reputations: reputations
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
}
