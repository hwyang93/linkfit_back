import {Injectable} from '@nestjs/common';
import {CreateRecruitDto} from './dto/create-recruit.dto';
import {UpdateRecruitDto} from './dto/update-recruit.dto';
import {Recruit} from "../entites/Recruit";
import {InjectRepository} from "@nestjs/typeorm";
import {Repository} from "typeorm";

@Injectable()
export class RecruitService {
  constructor(
      @InjectRepository(Recruit) private recruitRepository: Repository<Recruit>
  ) {}

  create(createRecruitDto: CreateRecruitDto) {
    return 'This action adds a new recruit';
  }

  async getRecruitList() {
    return await this.recruitRepository.find();
  }

  async getRecruit(id: number) {
    console.log(id);
    return await this.recruitRepository.createQueryBuilder('recruit')
        .where('recruit.seq = :seq', {seq: id})
        .innerJoinAndSelect('recruit.dates', 'dates')
        .getOne();
  }

  update(id: number, updateRecruitDto: UpdateRecruitDto) {
    return `This action updates a #${id} recruit`;
  }

  remove(id: number) {
    return `This action removes a #${id} recruit`;
  }
}
