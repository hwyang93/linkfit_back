import { Injectable, InternalServerErrorException, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { CreateRecruitDto } from './dto/create-recruit.dto';
import { UpdateRecruitDto } from './dto/update-recruit.dto';
import { Recruit } from '../../entites/Recruit';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import { SearchRecruitDto } from './dto/search-recruit.dto';
import { RecruitDate } from '../../entites/RecruitDate';
import { CreateRecruitApplyDto } from './dto/create-recruit-apply.dto';
import { RecruitApply } from '../../entites/RecruitApply';
import { UpdateRecruitApplyDto } from './dto/update-recruit-apply.dto';
import { Member } from '../../entites/Member';
import { RecruitFavorite } from '../../entites/RecruitFavorite';
import { CancelRecruitApplyDto } from './dto/cancel-recruit-apply.dto';
import { SearchRecruitApplyDto } from './dto/search-recruit-apply.dto';
const _ = require('lodash');

@Injectable()
export class RecruitService {
  constructor(
    @InjectRepository(Recruit) private recruitRepository: Repository<Recruit>,
    @InjectRepository(RecruitDate) private recruitDateRepository: Repository<RecruitDate>,
    @InjectRepository(RecruitApply) private recruitApplyRepository: Repository<RecruitApply>,
    @InjectRepository(RecruitFavorite) private recruitFavoriteRepository: Repository<RecruitFavorite>,
    @InjectRepository(Member) private memberRepository: Repository<Member>,
    private datasource: DataSource
  ) {}

  async createRecruit(createRecruitDto: CreateRecruitDto, member: Member) {
    if (!member) {
      throw new UnauthorizedException('로그인 후 이용해주세요.');
    }

    const recruit = createRecruitDto.toEntity();

    recruit.writerSeq = member.seq;

    recruit.status = 'ING';

    const queryRunner = this.datasource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();
    let savedRecruit;

    try {
      savedRecruit = await queryRunner.manager.getRepository(Recruit).save(recruit);

      if (createRecruitDto.dates.length > 0) {
        for (const item of createRecruitDto.dates) {
          const recruitDateEntity = new RecruitDate();
          recruitDateEntity.recruitSeq = savedRecruit.seq;
          recruitDateEntity.day = item.day;
          recruitDateEntity.time = item.time;
          await queryRunner.manager.getRepository(RecruitDate).save(recruitDateEntity);
        }
      }

      await queryRunner.commitTransaction();
    } catch (e) {
      console.log(e);
      await queryRunner.rollbackTransaction();
      throw new InternalServerErrorException('서버에서 에러가 발생했습니다.');
    } finally {
      await queryRunner.release();
    }

    return { seq: savedRecruit.seq };
  }

  async getRecruitListByMy(searchParam: SearchRecruitDto, member: Member) {
    const qb = this.recruitRepository
      .createQueryBuilder('recruit')
      .leftJoinAndSelect('recruit.writer', 'writer')
      .leftJoinAndSelect('writer.company', 'company')
      .select(['recruit', 'writer.name', 'company.companyName'])
      .where('recruit.writerSeq = :writerSeq', { writerSeq: member.seq });

    if (searchParam.status) {
      qb.andWhere('recruit.status = :status', { status: searchParam.status });
    }

    return qb.withDeleted().orderBy('recruit.updatedAt', 'DESC').getMany();
  }

  async getRecruitList(searchParam: SearchRecruitDto, member: Member) {
    const qb = this.recruitRepository
      .createQueryBuilder('recruit')
      .leftJoinAndSelect('recruit.writer', 'writer')
      .leftJoinAndSelect('recruit.dates', 'dates')
      .leftJoinAndSelect('writer.profileImage', 'profileImage')
      .leftJoinAndSelect('writer.company', 'company')
      .where('recruit.status = "ING"')
      .select(['recruit', 'writer.name', 'company.companyName', 'profileImage'])
      .addSelect(sq => {
        return sq
          .select('bookmarks.seq', 'isBookmark')
          .from(RecruitFavorite, 'bookmarks')
          .where('bookmarks.favoriteSeq = recruit.seq')
          .andWhere('bookmarks.memberSeq = :memberSeq', { memberSeq: member.seq });
      }, 'isBookmark');

    if (searchParam.area) {
      qb.andWhere('recruit.address IN (:address)', { address: `%${searchParam.area}%` });
    }
    if (searchParam.fields) {
      qb.andWhere('recruit.position IN (:fields)', { fields: searchParam.fields });
    }
    if (searchParam.recruitTypes) {
      qb.andWhere('recruit.recruitType IN (:recruitTypes)', { recruitTypes: searchParam.recruitTypes });
    }
    if (searchParam.times) {
      qb.andWhere('dates.time IN (:times)', { times: searchParam.times });
    }

    const recruitList = await qb.orderBy('recruit.updatedAt', 'DESC').getRawAndEntities();

    // recruitList = await recruitList.orderBy('recruit.updatedAt', 'DESC').getRawAndEntities();

    const result = [];
    recruitList.entities.forEach(item => {
      result.push({
        ...item,
        isBookmark: recruitList.raw.find(raw => {
          return raw.recruit_SEQ === item.seq;
        }).isBookmark
          ? 'Y'
          : 'N'
      });
    });
    return result;

    // return recruitList.orderBy('recruit.updatedAt', 'DESC').getMany();
  }

  async getRecruitMarkerList(searchParam: SearchRecruitDto, member: Member) {
    let pinData = await this.recruitRepository
      .createQueryBuilder('recruit')
      .select(['lon', 'lat', 'position'])
      // .addSelect('COUNT(DISTINCT("recruit.WRITER_SEQ"))', 'cnt')
      .where('recruit.address like :address', { address: `%${searchParam.area}%` });

    if (searchParam.fields) {
      pinData.andWhere('recruit.field IN (:...fields)', { fields: searchParam.fields });
    }
    if (searchParam.recruitTypes) {
      pinData.andWhere('recruit.recruitType IN (:...recruitTypes)', { recruitTypes: searchParam.recruitTypes });
    }
    if (searchParam.times) {
      pinData.andWhere('recruit.time IN (:...times)', { times: searchParam.times });
    }
    if (searchParam.isWriter === 'Y') {
      pinData.andWhere('recruit.writerSeq = :writerSeq', { writerSeq: member.seq });
    }

    pinData = pinData.groupBy('recruit.lon').addGroupBy('recruit.lat');
    return pinData.getRawMany();
  }

  async getRecruitRecommendedList(member: Member) {
    const qb = this.recruitRepository
      .createQueryBuilder('recruit')
      .limit(8)
      .leftJoinAndSelect('recruit.writer', 'writer')
      .leftJoinAndSelect('recruit.dates', 'dates')
      .leftJoinAndSelect('writer.profileImage', 'profileImage')
      .leftJoinAndSelect('writer.company', 'company')
      .leftJoin(
        sq => {
          return sq
            .select('recruitFavorite.favoriteSeq', 'favoriteSeq')
            .addSelect('COUNT(*)', 'bookmarkCount')
            .from(RecruitFavorite, 'recruitFavorite')
            .where('recruitFavorite.deletedAt IS NULL')
            .groupBy('recruitFavorite.favoriteSeq');
        },
        'bookmark',
        'recruit.seq = bookmark.favoriteSeq'
      )
      .select(['recruit', 'writer.name', 'company.companyName', 'profileImage'])
      // .addSelect(sq => {
      //   return sq
      //     .select('bookmarks.seq', 'isBookmark')
      //     .from(RecruitFavorite, 'bookmarks')
      //     .where('bookmarks.favoriteSeq = recruit.seq')
      //     .andWhere('bookmarks.memberSeq = :memberSeq', { memberSeq: member.seq });
      // }, 'isBookmark')
      .addSelect("IF(ISNULL(bookmark.favoriteSeq), 'N', 'Y')", 'isBookmark')
      .where('recruit.status = "ING"');
    const recruitList = await qb.orderBy({ 'bookmark.bookmarkCount': 'DESC', 'recruit.updatedAt': 'DESC' }).getRawAndEntities();
    const result = [];
    recruitList.entities.forEach(item => {
      result.push({
        ...item,
        isBookmark: recruitList.raw.find(raw => {
          return raw.recruit_SEQ === item.seq;
        }).isBookmark
      });
    });
    return result;
  }

  async getRecruitMarker(searchParam: SearchRecruitDto, lon: number, lat: number, member: Member) {
    const result = {
      company: [],
      instructor: []
    };
    const companyRecruit = await this.memberRepository
      .createQueryBuilder('member')
      .innerJoinAndSelect('member.company', 'company')
      .innerJoinAndSelect('member.recruits', 'recruits')
      .where("member.type = 'COMPANY'")
      .andWhere('recruits.lon = :lon', { lon: lon })
      .andWhere('recruits.lat = :lat', { lat: lat });

    const instructorRecruit = await this.memberRepository
      .createQueryBuilder('member')
      .innerJoinAndSelect('member.recruits', 'recruits')
      .where("member.type = 'INSTRUCTOR'")
      .andWhere('recruits.lon = :lon', { lon: lon })
      .andWhere('recruits.lat = :lat', { lat: lat });

    if (searchParam.fields) {
      companyRecruit.andWhere('recruits.position IN (:...fields)', { fields: searchParam.fields });
      instructorRecruit.andWhere('recruits.position IN (:...fields)', { fields: searchParam.fields });
    }
    if (searchParam.recruitTypes) {
      companyRecruit.andWhere('recruits.recruitType IN (:...recruitTypes)', { recruitTypes: searchParam.recruitTypes });
      instructorRecruit.andWhere('recruits.recruitType IN (:...recruitTypes)', { recruitTypes: searchParam.recruitTypes });
    }
    if (searchParam.times) {
      companyRecruit.andWhere('recruits.time IN (:...times)', { times: searchParam.times });
      instructorRecruit.andWhere('recruits.time IN (:...times)', { times: searchParam.times });
    }
    if (searchParam.isWriter === 'Y') {
      companyRecruit.andWhere('recruits.writerSeq = :writerSeq', { writerSeq: member.seq });
      instructorRecruit.andWhere('recruits.writerSeq = :writerSeq', { writerSeq: member.seq });
    }

    result.company = await companyRecruit.getMany();
    result.instructor = await instructorRecruit.getMany();

    return result;
  }

  async getRecruit(seq: number, member: Member) {
    const recruitInfo = await this.recruitRepository
      .createQueryBuilder('recruit')
      .where('recruit.seq = :seq', { seq: seq })
      .leftJoinAndSelect('recruit.dates', 'dates')
      .leftJoinAndSelect('recruit.writer', 'writer')
      .leftJoinAndSelect('writer.company', 'company')
      .getOne();
    let applyInfo;
    if (member) {
      applyInfo = await this.recruitApplyRepository
        .createQueryBuilder('recruitApply')
        .where('recruitApply.memberSeq = :memberSeq', { memberSeq: member.seq })
        .andWhere('recruitApply.recruitSeq = :recruitSeq', { recruitSeq: recruitInfo.seq })
        .andWhere('recruitApply.status != "CANCEL"')
        .orderBy('recruitApply.updatedAt', 'DESC')
        .getMany();

      recruitInfo.dates.forEach(item => {
        const isApply = applyInfo.find(apply => {
          return apply.recruitDateSeq === item.seq;
        });
        isApply ? (item['isApplied'] = true) : (item['isApplied'] = false);
      });
    }
    return { ...recruitInfo, applyInfo };
  }

  update(id: number, updateRecruitDto: UpdateRecruitDto, member: Member) {
    return `This action updates a #${id} recruit`;
  }

  async deleteRecruit(seq: number, member: Member) {
    const recruit = await this.getRecruit(seq, member);

    if (!recruit) {
      throw new NotFoundException('게시글이 존재하지 않습니다.');
    }

    if (recruit.writerSeq !== member.seq) {
      throw new UnauthorizedException('허용되지 않은 접근입니다.');
    }
    return this.recruitRepository.delete(seq);
  }

  async createRecruitApply(seq: number, createRecruitApplyDto: CreateRecruitApplyDto, member: Member) {
    if (!member) {
      throw new UnauthorizedException('로그인 후 이용해주세요.');
    }
    const queryRunner = this.datasource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      for (const recruitDateSeq of createRecruitApplyDto.recruitDateSeq) {
        const apply = new RecruitApply();
        apply.memberSeq = member.seq;
        apply.resumeSeq = createRecruitApplyDto.resumeSeq;
        apply.recruitSeq = seq;
        apply.recruitDateSeq = recruitDateSeq;
        apply.status = 'APPLY';

        await queryRunner.manager.getRepository(RecruitApply).save(apply);
      }

      await queryRunner.commitTransaction();
    } catch (e) {
      console.log(e);
      await queryRunner.rollbackTransaction();
      throw new InternalServerErrorException('서버에서 에러가 발생했습니다.');
    } finally {
      await queryRunner.release();
    }
  }

  getRecruitApplyListByMember(searchParams: SearchRecruitApplyDto, member: Member) {
    const recruitApply = this.recruitApplyRepository
      .createQueryBuilder('recruitApply')
      .where('recruitApply.memberSeq = :memberSeq', { memberSeq: member.seq })
      .leftJoinAndSelect('recruitApply.recruit', 'recruit');
    if (searchParams.period) {
    }
    if (searchParams.status) {
      recruitApply.andWhere('recruitApply.status = :status', { status: searchParams.status });
    }
    return recruitApply.getMany();
  }

  async cancelRecruitApply(cancelRecruitApplyDto: CancelRecruitApplyDto, member: Member) {
    const queryRunner = this.datasource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      for (const recruitDateSeqs of cancelRecruitApplyDto.recruitDateSeqs) {
        console.log(recruitDateSeqs);

        await queryRunner.manager.getRepository(RecruitApply).update({ seq: recruitDateSeqs }, { status: 'CANCEL' });
      }
      await queryRunner.commitTransaction();
    } catch (e) {
      console.log(e);
      await queryRunner.rollbackTransaction();
      throw new InternalServerErrorException('서버에서 에러가 발생했습니다.');
    } finally {
      await queryRunner.release();
    }
    return cancelRecruitApplyDto;
  }

  async getRecruitApply(seq: number, member: Member) {
    const recruitApply = await this.recruitApplyRepository
      .createQueryBuilder('recruitApply')
      .where({ seq })
      .leftJoinAndSelect('recruitApply.resume', 'resume')
      .leftJoinAndSelect('recruitApply.recruit', 'recruit')
      .leftJoinAndSelect('recruitApply.recruitDate', 'recruitDate')
      // .leftJoinAndSelect('')
      .getOne();
    const recruit = await this.recruitRepository.createQueryBuilder('recruit').where({ seq: recruitApply.recruitSeq }).getOne();

    if (recruit.writerSeq !== member.seq && recruitApply.memberSeq !== member.seq) {
      throw new UnauthorizedException('허용되지 않은 접근입니다.');
    }

    return recruitApply;
  }

  async getRecruitBookmarkList(member: Member) {
    const favoriteList = await this.recruitFavoriteRepository
      .createQueryBuilder('recruitFavorite')
      .where({ memberSeq: member.seq })
      .innerJoinAndSelect('recruitFavorite.recruit', 'recruit')
      .leftJoinAndSelect('recruit.writer', 'writer')
      .leftJoinAndSelect('writer.profileImage', 'profileImage')
      .getMany();

    const result = [];
    favoriteList.forEach(item => {
      item.recruit['isBookmark'] = 'Y';
      result.push({ ...item });
    });
    return result;
  }

  async deleteRecruitApply(seq: number, member: Member) {
    if (!member) {
      throw new UnauthorizedException('로그인 후 이용해주세요.');
    }
    const recruitApply = await this.getRecruitApply(seq, member);
    if (recruitApply.memberSeq !== member.seq) {
      throw new UnauthorizedException('허용되지 않은 접근입니다.');
    }

    return this.recruitApplyRepository.delete(seq);
  }

  async createRecruitBookmark(seq: number, member: Member) {
    const recruitFavorite = new RecruitFavorite();
    recruitFavorite.memberSeq = member.seq;
    recruitFavorite.favoriteSeq = seq;

    const checkRecruitBookmark = await this.recruitFavoriteRepository
      .createQueryBuilder('recruitFavorite')
      .where('recruitFavorite.memberSeq = :memberSeq', { memberSeq: member.seq })
      .andWhere('recruitFavorite.favoriteSeq = :favoriteSeq', { favoriteSeq: seq })
      .withDeleted()
      .getOne();

    let savedSeq;

    if (!checkRecruitBookmark) {
      const { seq } = await this.recruitFavoriteRepository.save(recruitFavorite);
      savedSeq = seq;
    } else {
      await this.recruitFavoriteRepository
        .createQueryBuilder('recruitFavorite')
        .restore()
        .where('memberSeq = :memberSeq', { memberSeq: member.seq })
        .andWhere('favoriteSeq = :favoriteSeq', { favoriteSeq: seq })
        .execute();

      savedSeq = checkRecruitBookmark.seq;
    }
    return { seq: savedSeq };
  }

  async deleteRecruitBookmark(seq: number, member: Member) {
    const recruitBookmark = await this.recruitFavoriteRepository.createQueryBuilder('recruitFavorite').where('recruitFavorite.favoriteSeq = :seq', { seq }).getOne();
    if (recruitBookmark.memberSeq !== member.seq) {
      throw new UnauthorizedException('허용되지 않은 접근입니다.');
    }
    await this.recruitFavoriteRepository
      .createQueryBuilder('recruitFavorite')
      .softDelete()
      .where('favoriteSeq = :seq', { seq })
      .andWhere('memberSeq = :memberSeq', { memberSeq: member.seq })
      .execute();
    return { seq };
  }

  async getRecruitApplyListBySeq(recruitSeq: number, member: Member) {
    const result: any = {};
    if (!member) {
      throw new UnauthorizedException('로그인 후 이용해주세요.');
    }
    const recruit = await this.getRecruit(recruitSeq, member);
    if (recruit.writerSeq !== member.seq) {
      throw new UnauthorizedException('허용되지 않은 접근입니다.');
    }
    const recruitApply = await this.recruitApplyRepository
      .createQueryBuilder('recruitApply')
      .where('recruitApply.recruitSeq = :recruitSeq', { recruitSeq: recruitSeq })
      .leftJoinAndSelect('recruitApply.resume', 'resume')
      .leftJoinAndSelect('recruitApply.recruitDate', 'recruitDate')
      .orderBy('recruitApply.updatedAt', 'DESC')
      .getMany();

    result.recruit = recruit;
    result.recruitApply = recruitApply;

    return result;
  }

  async updateRecruitApply(seq: number, updateRecruitApplyDto: UpdateRecruitApplyDto, member: Member) {
    if (!member) {
      throw new UnauthorizedException('로그인 후 이용해주세요.');
    }
    await this.recruitApplyRepository.createQueryBuilder('recruitApply').update().set({ status: updateRecruitApplyDto.status }).where({ seq }).execute();
    return { seq };
  }
}
