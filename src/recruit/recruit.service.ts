import {Injectable} from '@nestjs/common';
import {CreateRecruitDto} from './dto/create-recruit.dto';
import {UpdateRecruitDto} from './dto/update-recruit.dto';
import {Recruit} from "../entites/Recruit";
import {InjectRepository} from "@nestjs/typeorm";
import {Repository} from "typeorm";
import {SearchRecruitDto} from "./dto/search-recruit.dto";
import { RecruitDate } from "../entites/RecruitDate";

@Injectable()
export class RecruitService {
  constructor(
      @InjectRepository(Recruit) private recruitRepository: Repository<Recruit>,
      @InjectRepository(RecruitDate) private recruitDateRepository: Repository<RecruitDate>
  ) {}

  async create(createRecruitDto: CreateRecruitDto) {
    const recruit = new Recruit(createRecruitDto);
    const recruitDates = [];

    recruit.status = "ing";
    const savedRecruit = await this.recruitRepository.save(recruit);

    if (createRecruitDto.dates.length > 0) {
      createRecruitDto.dates.forEach(item => {
        const data = new RecruitDate(item);
        data.recruitSeq = savedRecruit.seq
        recruitDates.push(data);
      });
    }
    for (const item of recruitDates) {
     await this.recruitDateRepository.save(item);
    }
    return {seq: savedRecruit.seq};
  }

  async getRecruitList(searchParam: SearchRecruitDto) {
    let qb = this.recruitRepository.createQueryBuilder('recruit').leftJoin('recruit.dates', 'dates')
        .where('1=1');

    if (searchParam.field) {
      qb.andWhere('recruit.field = :field', {filed: searchParam.field})
    }

    if (searchParam.recruitType) {
      qb.andWhere('recruit.recruitType = :recruitType', {recruitType: searchParam.recruitType})
    }

    if (searchParam.time) {
      qb.andWhere('recruit.time = :time', {time: searchParam.time})
    }

    return  qb.getMany();
  }

  async getRecruit(seq: number) {
    console.log(seq);
    return await this.recruitRepository.createQueryBuilder('recruit')
        .where('recruit.seq = :seq', {seq: seq})
        .leftJoinAndSelect('recruit.dates', 'dates')
        .getOne();
  }

  update(id: number, updateRecruitDto: UpdateRecruitDto) {
    return `This action updates a #${id} recruit`;
  }

  deleteRecruit(id: number) {
    return this.recruitRepository.delete(id);
  }
}
