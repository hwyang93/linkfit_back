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
// import _ from 'lodash';
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

    recruit.status = 'ing';

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

  async getRecruitList(searchParam: SearchRecruitDto, member: Member) {
    // const pinData = await this.recruitRepository
    //   .createQueryBuilder('recruit')
    //   .where('recruit.address like :address', { address: `%${searchParam.area}%` })
    //   .groupBy('recruit.lon')
    //   .addGroupBy('recruit.lat')
    //   .select(['recruit.lon', 'recruit.lat'])
    //   .getMany();
    let pinData = await this.recruitRepository
      .createQueryBuilder('recruit')
      .where('recruit.address like :address', { address: `%${searchParam.area}%` })
      .getMany();
    console.log(pinData);
    pinData = _.chain(pinData)
      .groupBy('lon')
      .map(function (v, i) {
        console.log('==================================================');
        console.log(v);
        return {
          lat: v[0]?.lat,
          lon: parseFloat(i),
          company: _.chain(v).groupBy('writerSeq'),
          recruits: _.chain(v)
            .map(v => {
              return v;
            })
            .value()
        };
      })
      .value();
    const result = pinData;

    // for (const item of pinData) {
    //   const pinInfo = {
    //     lon: item.lon,
    //     lat: item.lat,
    //     company: [],
    //     instructor: []
    //   };
    //   const companyRecruits = await this.recruitRepository
    //     .createQueryBuilder('recruit')
    //     .leftJoin('recruit.dates', 'dates')
    //     .innerJoinAndSelect('recruit.writer', 'writer')
    //     .innerJoinAndSelect('writer.company', 'company')
    //     .where('writer.type = :type', { type: 'COMPANY' })
    //     .andWhere('recruit.lon = :lon', { lon: item.lon })
    //     .andWhere('recruit.lat = :lat', { lat: item.lat });
    //   if (searchParam.fields) {
    //     companyRecruits.andWhere('recruit.field IN (:...fields)', { fields: searchParam.fields });
    //   }
    //   if (searchParam.recruitTypes) {
    //     companyRecruits.andWhere('recruit.recruitType IN (:...recruitTypes)', { recruitTypes: searchParam.recruitTypes });
    //   }
    //   if (searchParam.times) {
    //     companyRecruits.andWhere('recruit.time IN (:...times)', { times: searchParam.times });
    //   }
    //   if (searchParam.isWriter === 'Y') {
    //     companyRecruits.andWhere('recruit.writerSeq = :writerSeq', { writerSeq: member.seq });
    //   }
    //   pinInfo.company = await companyRecruits.getMany();
    //
    //   const instructorRecruits = await this.recruitRepository
    //     .createQueryBuilder('recruit')
    //     .leftJoin('recruit.dates', 'dates')
    //     .innerJoinAndSelect('recruit.writer', 'writer')
    //     .where('writer.type = :type', { type: 'INSTRUCTOR' })
    //     .andWhere('recruit.lon = :lon', { lon: item.lon })
    //     .andWhere('recruit.lat = :lat', { lat: item.lat });
    //   if (searchParam.fields) {
    //     instructorRecruits.andWhere('recruit.field IN (:...fields)', { fields: searchParam.fields });
    //   }
    //   if (searchParam.recruitTypes) {
    //     instructorRecruits.andWhere('recruit.recruitType IN (:...recruitTypes)', { recruitTypes: searchParam.recruitTypes });
    //   }
    //   if (searchParam.times) {
    //     instructorRecruits.andWhere('recruit.time IN (:...times)', { times: searchParam.times });
    //   }
    //   if (searchParam.isWriter === 'Y') {
    //     instructorRecruits.andWhere('recruit.writerSeq = :writerSeq', { writerSeq: member.seq });
    //   }
    //
    //   pinInfo.instructor = await instructorRecruits.getMany();
    //
    //   result.push(pinInfo);
    // }

    // const qb = this.recruitRepository.createQueryBuilder('recruit').leftJoin('recruit.dates', 'dates').where('1=1');
    //
    // if (searchParam.fields) {
    //   qb.andWhere('recruit.field IN (:...fields)', { fields: searchParam.fields });
    // }
    //
    // if (searchParam.recruitTypes) {
    //   qb.andWhere('recruit.recruitType IN (:...recruitTypes)', { recruitTypes: searchParam.recruitTypes });
    // }
    //
    // if (searchParam.times) {
    //   qb.andWhere('recruit.time IN (:...times)', { times: searchParam.times });
    // }
    //
    // if (searchParam.isWriter === 'Y') {
    //   qb.andWhere('recruit.writerSeq = :writerSeq', { writerSeq: member.seq });
    // }
    //
    // return qb.getMany();
    return result;
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

  async getRecruit(seq: number) {
    return await this.recruitRepository.createQueryBuilder('recruit').where('recruit.seq = :seq', { seq: seq }).leftJoinAndSelect('recruit.dates', 'dates').getOne();
  }

  update(id: number, updateRecruitDto: UpdateRecruitDto, member: Member) {
    return `This action updates a #${id} recruit`;
  }

  async deleteRecruit(seq: number, member: Member) {
    const recruit = await this.getRecruit(seq);

    if (!recruit) {
      throw new NotFoundException('게시글이 존재하지 않습니다.');
    }

    if (recruit.writerSeq !== member.seq) {
      throw new UnauthorizedException('허용되지 않은 접근입니다.');
    }
    return this.recruitRepository.delete(seq);
  }

  async createRecruitApply(createRecruitApplyDto: CreateRecruitApplyDto, member: Member) {
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
        apply.recruitSeq = createRecruitApplyDto.recruitSeq;
        apply.recruitDateSeq = recruitDateSeq;
        apply.status = 'apply';

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

  getRecruitApplyListByMember(member: Member) {
    return this.recruitApplyRepository
      .createQueryBuilder('recruitApply')
      .where('recruitApply.memberSeq = :memberSeq', { memberSeq: member.seq })
      .innerJoinAndSelect('recruitApply.recruitDate', 'recruitDate')
      .getMany();
  }

  async getRecruitApply(seq: number, member: Member) {
    const recruitApply = await this.recruitApplyRepository
      .createQueryBuilder('recruitApply')
      .where({ seq })
      .innerJoinAndSelect('recruitApply.resume', 'resume')
      .innerJoinAndSelect('recruitApply.recruit', 'recruit')
      .innerJoinAndSelect('recruitApply.recruitDate', 'recruitDate')
      .getOne();
    const recruit = await this.recruitRepository.createQueryBuilder('recruit').where({ seq: recruitApply.recruitSeq }).getOne();

    if (recruit.writerSeq !== member.seq || recruitApply.memberSeq !== member.seq) {
      throw new UnauthorizedException('허용되지 않은 접근입니다.');
    }

    return recruitApply;
  }

  getRecruitBookmarkList(member: Member) {
    return this.recruitFavoriteRepository.createQueryBuilder('recruitFavorite').where({ memberSeq: member.seq }).innerJoinAndSelect('recruitFavorite.recruit', 'recruit').getMany();
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
    const recruitBookmark = await this.recruitFavoriteRepository.createQueryBuilder('recruitFavorite').where({ seq }).getOne();
    if (recruitBookmark.memberSeq !== member.seq) {
      throw new UnauthorizedException('허용되지 않은 접근입니다.');
    }
    await this.recruitFavoriteRepository.createQueryBuilder('recruitFavorite').softDelete().where({ seq }).execute();
    return { seq };
  }

  async getRecruitApplyListBySeq(recruitSeq: number, member: Member) {
    if (!member) {
      throw new UnauthorizedException('로그인 후 이용해주세요.');
    }
    const recruit = await this.getRecruit(recruitSeq);
    if (recruit.writerSeq !== member.seq) {
      throw new UnauthorizedException('허용되지 않은 접근입니다.');
    }
    return this.recruitApplyRepository
      .createQueryBuilder('recruitApply')
      .where('recruitApply.recruitSeq = :recruitSeq', { recruitSeq: recruitSeq })
      .innerJoinAndSelect('recruitApply.recruitDate', 'recruitDate')
      .getMany();
  }

  async updateRecruitApply(seq: number, updateRecruitApplyDto: UpdateRecruitApplyDto, member: Member) {
    if (!member) {
      throw new UnauthorizedException('로그인 후 이용해주세요.');
    }

    return this.recruitApplyRepository.createQueryBuilder('recruitApply').update(RecruitApply).set({ status: updateRecruitApplyDto.status }).where('recruitApply.seq = :seq', { seq: seq });
  }
}
