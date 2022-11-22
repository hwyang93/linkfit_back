import { Injectable } from '@nestjs/common';
import { CreateRecruitDto } from './dto/create-recruit.dto';
import { UpdateRecruitDto } from './dto/update-recruit.dto';
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

  async getRecruits() {
    const result = await this.recruitRepository.find();
    console.log(result)
    return `This action returns all recruit`;
  }

  findOne(id: number) {
    return `This action returns a #${id} recruit`;
  }

  update(id: number, updateRecruitDto: UpdateRecruitDto) {
    return `This action updates a #${id} recruit`;
  }

  remove(id: number) {
    return `This action removes a #${id} recruit`;
  }
}
