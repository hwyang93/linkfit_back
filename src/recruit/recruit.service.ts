import { HttpException, Injectable } from '@nestjs/common';
import { CreateRecruitDto } from './dto/create-recruit.dto';
import { UpdateRecruitDto } from './dto/update-recruit.dto';
import { Recruit } from '../entites/Recruit';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import { SearchRecruitDto } from './dto/search-recruit.dto';
import { RecruitDate } from '../entites/RecruitDate';
import { CreateRecruitApplyDto } from './dto/create-recruit-apply.dto';
import { RecruitApply } from '../entites/RecruitApply';

@Injectable()
export class RecruitService {
  constructor(
    @InjectRepository(Recruit) private recruitRepository: Repository<Recruit>,
    @InjectRepository(RecruitDate) private recruitDateRepository: Repository<RecruitDate>,
    @InjectRepository(RecruitApply) private recruitApplyRepository: Repository<RecruitApply>,
    private datasource: DataSource
  ) {}

  async create(createRecruitDto: CreateRecruitDto) {
    const recruit = new Recruit(createRecruitDto);
    const recruitDates = [];

    recruit.status = 'ing';

    const queryRunner = this.datasource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();
    let savedRecruit;

    try {
      savedRecruit = await this.recruitRepository.save(recruit);

      if (createRecruitDto.dates.length > 0) {
        createRecruitDto.dates.forEach(item => {
          const data = new RecruitDate(item);
          data.recruitSeq = savedRecruit.seq;
          recruitDates.push(data);
        });
      }
      for (const item of recruitDates) {
        await this.recruitDateRepository.save(item);
      }

      await queryRunner.commitTransaction();
    } catch (e) {
      console.log(e);
      await queryRunner.rollbackTransaction();
    } finally {
      await queryRunner.release();
    }

    return { seq: savedRecruit.seq };
  }

  async getRecruitList(searchParam: SearchRecruitDto) {
    let qb = this.recruitRepository.createQueryBuilder('recruit').leftJoin('recruit.dates', 'dates').where('1=1');

    if (searchParam.field) {
      qb.andWhere('recruit.field = :field', { filed: searchParam.field });
    }

    if (searchParam.recruitType) {
      qb.andWhere('recruit.recruitType = :recruitType', { recruitType: searchParam.recruitType });
    }

    if (searchParam.time) {
      qb.andWhere('recruit.time = :time', { time: searchParam.time });
    }

    return qb.getMany();
  }

  async getRecruit(seq: number) {
    return await this.recruitRepository.createQueryBuilder('recruit').where('recruit.seq = :seq', { seq: seq }).leftJoinAndSelect('recruit.dates', 'dates').getOne();
  }

  update(id: number, updateRecruitDto: UpdateRecruitDto) {
    return `This action updates a #${id} recruit`;
  }

  deleteRecruit(seq: number) {
    // 자신이 작성한 게시글인지 확인 로직 추가해야함

    return this.recruitRepository.delete(seq);
  }

  async recruitApply(createRecruitApplyDto: CreateRecruitApplyDto) {
    const queryRunner = this.datasource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      for (const recruitDateSeq of createRecruitApplyDto.recruitDateSeq) {
        const apply = new RecruitApply();
        apply.memberSeq = 1;
        apply.recruitSeq = createRecruitApplyDto.recruitSeq;
        apply.recruitDateSeq = recruitDateSeq;
        apply.status = 'apply';

        await this.recruitApplyRepository.save(apply);
      }

      await queryRunner.commitTransaction();
    } catch (e) {
      console.log(e);
      await queryRunner.rollbackTransaction();
    } finally {
      await queryRunner.release();
    }
  }

  async deleteRecruitApply(seq: number) {
    // 자신이 작성한 게시글인지 확인 로직 추가해야함

    return this.recruitApplyRepository.delete(seq);
  }
}
