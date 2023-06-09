import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Member } from '../../entites/Member';
import { Repository } from 'typeorm';
import { MemberReputation } from '../../entites/MemberReputation';
import { Company } from '../../entites/Company';
import { RecruitFavorite } from '../../entites/RecruitFavorite';
import { MemberFavorite } from '../../entites/MemberFavorite';
import { Recruit } from '../../entites/Recruit';
import { CheckCompanyDto } from './dto/check-company.dto';
import axios from 'axios';
import { ConfigService } from '@nestjs/config';
import { response } from 'express';

@Injectable()
export class CompanyService {
  constructor(
    @InjectRepository(Member) private memberRepository: Repository<Member>,
    @InjectRepository(Company) private companyRepository: Repository<Company>,
    @InjectRepository(Recruit) private recruitRepository: Repository<Recruit>,
    @InjectRepository(MemberReputation) private memberReputationRepository: Repository<MemberReputation>,
    @InjectRepository(RecruitFavorite) private recruitFavoriteRepository: Repository<RecruitFavorite>,
    @InjectRepository(MemberFavorite) private memberFavoriteRepository: Repository<MemberFavorite>,
    private configService: ConfigService
  ) {}

  async getCompanyCheck(checkCompanyDto: CheckCompanyDto) {
    await this.validateCompany(checkCompanyDto).catch(error => {
      throw new NotFoundException(error.response.message);
    });

    const companyInfo = await this.companyRepository.createQueryBuilder('company').where('company.businessNumber = :businessNumber', { businessNumber: checkCompanyDto.businessNumber }).getOne();

    if (companyInfo) {
      return { duplication: true };
    }
  }

  async getCompanyInfo(seq: number, member: Member) {
    const result = {
      companyInfo: {},
      recruits: {},
      reputations: {}
    };
    const companyInfoRawAndEntities = await this.companyRepository
      .createQueryBuilder('company')
      .leftJoinAndSelect('company.member', 'member')
      .leftJoinAndSelect('member.profileImage', 'profileImage')
      .leftJoinAndSelect('member.links', 'links')
      .leftJoinAndSelect(
        sq => {
          return sq
            .select('memberFavorite.favoriteSeq', 'favoriteSeq')
            .addSelect('COUNT(memberFavorite.favoriteSeq)', 'followerCount')
            .from(MemberFavorite, 'memberFavorite')
            .groupBy('memberFavorite.favoriteSeq');
        },
        'follower',
        'follower.favoriteSeq = member.seq'
      )
      .addSelect('IFNULL(follower.followerCount, 0)', 'followerCount')
      .where('company.memberSeq = :seq', { seq })
      .getRawAndEntities();

    const companyInfo = {
      ...companyInfoRawAndEntities.entities[0],
      followerCount: parseInt(
        companyInfoRawAndEntities.raw.find(raw => {
          return raw.member_SEQ === seq;
        })?.followerCount
      )
    };

    let recruits = await this.recruitRepository
      .createQueryBuilder('recruit')
      .leftJoinAndSelect('recruit.dates', 'dates')
      .where('recruit.writerSeq = :writerSeq', { writerSeq: seq })
      .andWhere('recruit.status = "ING"')
      .getMany();

    const reputations = await this.memberReputationRepository
      .createQueryBuilder('memberReputation')
      .leftJoinAndSelect('memberReputation.evaluationMember', 'evaluationMember')
      .where('memberReputation.targetMemberSeq = :memberSeq', { memberSeq: seq })
      .orderBy('memberReputation.updatedAt', 'DESC')
      .getMany();
    if (member) {
      const bookmarks = await this.recruitFavoriteRepository.createQueryBuilder('recruitFavorite').innerJoinAndSelect('recruitFavorite.recruit', 'recruit').where({ memberSeq: member.seq }).getMany();
      const follows = await this.memberFavoriteRepository.createQueryBuilder('memberFavorite').where('memberFavorite.memberSeq = :memberSeq', { memberSeq: member.seq }).getMany();
      result.companyInfo = {
        ...companyInfo,
        isFollow: follows.find(follow => {
          return follow.favoriteSeq === companyInfo.memberSeq;
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

  async validateCompany(checkCompanyDto: CheckCompanyDto) {
    const params = { businesses: [{ b_no: checkCompanyDto.businessNumber, start_dt: checkCompanyDto.startDate, p_nm: checkCompanyDto.owner }] };
    await axios
      .post(`https://api.odcloud.kr/api/nts-businessman/v1/validate?serviceKey=${this.configService.get('DATA_SERVICE_KEY')}`, JSON.stringify(params), {
        headers: { 'Content-Type': 'application/json' }
      })
      .then(({ data }: any) => {
        const result = data.data[0];
        if (result.valid === '02') {
          throw new NotFoundException(result.valid_msg);
        }
      })
      .catch(error => {
        if (error.response.message) {
          throw new NotFoundException(error.response.message);
        } else {
          throw new NotFoundException(error.response.data.status_code);
        }
      });
  }
}
