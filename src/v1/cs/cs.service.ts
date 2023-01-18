import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Cs } from '../../entites/Cs';

@Injectable()
export class CsService {
  constructor(@InjectRepository(Cs) private csRepository: Repository<Cs>) {}

  async getCsList(type: string) {
    return await this.csRepository.createQueryBuilder('cs').where('cs.type = :type', { type }).orderBy('cs.updateAt', 'DESC').getMany();
  }

  async getCs(seq: number) {
    return await this.csRepository.createQueryBuilder('cs').where('cs.seq = :seq', { seq }).getOne();
  }
}
