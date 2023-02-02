import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Member } from '../entites/Member';
import { Repository } from 'typeorm';
import { MemberReputation } from '../entites/MemberReputation';
import { Company } from '../entites/Company';
import { RecruitFavorite } from '../entites/RecruitFavorite';
import { MemberFavorite } from '../entites/MemberFavorite';
import { Recruit } from '../entites/Recruit';

@Injectable()
export class CompanyService {
  constructor(
    @InjectRepository(Member) private memberRepository: Repository<Member>,
    @InjectRepository(Company) private companyRepository: Repository<Company>,
    @InjectRepository(Recruit) private recruitRepository: Repository<Recruit>,
    @InjectRepository(MemberReputation) private memberReputationRepository: Repository<MemberReputation>,
    @InjectRepository(RecruitFavorite) private recruitFavoriteRepository: Repository<RecruitFavorite>,
    @InjectRepository(MemberFavorite) private memberFavoriteRepository: Repository<MemberFavorite>
  ) {}

  async getCompanyInfo(seq: number, member: Member) {
    const result = {
      companyInfo: {},
      recruits: {},
      reputations: {}
    };
    const companyInfo = await this.companyRepository
      .createQueryBuilder('company')
      .leftJoinAndSelect('company.member', 'member')
      .leftJoinAndSelect('member.links', 'links')
      .where('company.memberSeq = :seq', { seq })
      .getOne();

    let recruits = await this.recruitRepository.createQueryBuilder('recruit').leftJoinAndSelect('recruit.dates', 'dates').where('recruit.writerSeq = :writerSeq', { writerSeq: seq }).getMany();
    console.log(recruits);
    const reputations = await this.memberReputationRepository
      .createQueryBuilder('memberReputation')
      .leftJoinAndSelect('memberReputation.evaluationMember', 'evaluationMember')
      .where('memberReputation.targetMemberSeq = :memberSeq', { memberSeq: seq })
      .getMany();

    if (member) {
      const bookmarks = await this.recruitFavoriteRepository.createQueryBuilder('recruitFavorite').innerJoinAndSelect('recruitFavorite.recruit', 'recruit').where({ memberSeq: member.seq }).getMany();
      const follows = await this.memberFavoriteRepository.createQueryBuilder('memberFavorite').where('memberFavorite.memberSeq', { memberSeq: member.seq }).getMany();

      result.companyInfo = {
        ...companyInfo,
        isFollow: follows.find(follow => {
          return follow.favoriteSeq === result.companyInfo['memberSeq'];
        })
          ? 'Y'
          : 'N'
      };

      recruits = recruits.map(recruit => {
        return {
          ...recruit,
          isBookmark: bookmarks.find(bookmark => {
            return bookmark.favoriteSeq === recruit.seq;
          })
            ? 'Y'
            : 'N'
        };
      });
    } else {
      result.companyInfo = {
        ...companyInfo,
        isFollow: 'N'
      };
      recruits = recruits.map(recruit => {
        return {
          ...recruit,
          isBookmark: 'N'
        };
      });
    }

    result.recruits = recruits;
    result.reputations = reputations;
    return result;
  }
}
