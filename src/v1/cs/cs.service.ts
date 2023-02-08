import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Cs } from '../../entites/Cs';
import { SearchCsDto } from './dto/search-cs.dto';

@Injectable()
export class CsService {
  constructor(@InjectRepository(Cs) private csRepository: Repository<Cs>) {}

  async getCsList(searchParam: SearchCsDto) {
    return await this.csRepository.createQueryBuilder('cs').where('cs.type = :type', { type: searchParam.type }).orderBy('cs.updatedAt', 'DESC').getMany();
  }

  async getCs(seq: number) {
    return await this.csRepository.createQueryBuilder('cs').where('cs.seq = :seq', { seq }).getOne();
  }
}
