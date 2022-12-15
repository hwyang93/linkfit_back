import { HttpException, Injectable, InternalServerErrorException, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { CreateRecruitDto } from './dto/create-recruit.dto';
import { UpdateRecruitDto } from './dto/update-recruit.dto';
import { Recruit } from '../entites/Recruit';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import { SearchRecruitDto } from './dto/search-recruit.dto';
import { RecruitDate } from '../entites/RecruitDate';
import { CreateRecruitApplyDto } from './dto/create-recruit-apply.dto';
import { RecruitApply } from '../entites/RecruitApply';
import { UpdateRecruitApplyDto } from './dto/update-recruit-apply.dto';
import { Member } from '../entites/Member';

@Injectable()
export class RecruitService {
  constructor(
    @InjectRepository(Recruit) private recruitRepository: Repository<Recruit>,
    @InjectRepository(RecruitDate) private recruitDateRepository: Repository<RecruitDate>,
    @InjectRepository(RecruitApply) private recruitApplyRepository: Repository<RecruitApply>,
    private datasource: DataSource
  ) {}

  async createRecruit(createRecruitDto: CreateRecruitDto, member: Member) {
    if (!member) {
      throw new UnauthorizedException('로그인 후 이용해주세요.');
    }

    const recruit = createRecruitDto.toEntity();
    const recruitDates = [];

    recruit.writerSeq = member.seq;

    recruit.status = 'ing';

    const queryRunner = this.datasource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();
    let savedRecruit;

    try {
      savedRecruit = await queryRunner.manager.getRepository(Recruit).save(recruit);

      if (createRecruitDto.dates.length > 0) {
        createRecruitDto.dates.forEach(item => {
          const recruitDateEntity = new RecruitDate();
          recruitDateEntity.recruitSeq = savedRecruit.seq;
          recruitDateEntity.day = item.day;
          recruitDateEntity.time = item.time;
          recruitDates.push(recruitDateEntity);
        });
      }
      for (const item of recruitDates) {
        await queryRunner.manager.getRepository(RecruitDate).save(item);
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
    const qb = this.recruitRepository.createQueryBuilder('recruit').leftJoin('recruit.dates', 'dates').where('1=1');

    if (searchParam.fields) {
      qb.andWhere('recruit.field IN (:...fields)', { fields: searchParam.fields });
    }

    if (searchParam.recruitTypes) {
      qb.andWhere('recruit.recruitType IN (:...recruitTypes)', { recruitTypes: searchParam.recruitTypes });
    }

    if (searchParam.times) {
      qb.andWhere('recruit.time IN (:...times)', { times: searchParam.times });
    }

    if (searchParam.isWriter) {
      qb.andWhere('recruit.writerSeq = :writerSeq', { writerSeq: member.seq });
    }

    return qb.getMany();
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
      throw new UnauthorizedException('작성자가 아닙니다.');
    }
    return this.recruitRepository.delete(seq);
  }

  async recruitApply(createRecruitApplyDto: CreateRecruitApplyDto, member: Member) {
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

  async deleteRecruitApply(seq: number, member: Member) {
    // 자신이 작성한 게시글인지 확인 로직 추가해야함
    if (!member) {
      throw new UnauthorizedException('로그인 후 이용해주세요.');
    }

    return this.recruitApplyRepository.delete(seq);
  }

  getRecruitApplyList(recruitSeq: number, member: Member) {
    if (!member) {
      throw new UnauthorizedException('로그인 후 이용해주세요.');
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
