import { Injectable } from '@nestjs/common';
import { CreateResumeDto } from './dto/create-resume.dto';
import { UpdateResumeDto } from './dto/update-resume.dto';
import { Member } from '../../entites/Member';
import { InjectRepository } from '@nestjs/typeorm';
import { Recruit } from '../../entites/Recruit';
import { Repository } from 'typeorm';
import { Resume } from '../../entites/Resume';

@Injectable()
export class ResumeService {
  constructor(@InjectRepository(Resume) private resumeRepository: Repository<Resume>) {}
  create(createResumeDto: CreateResumeDto) {
    return 'This action adds a new resume';
  }

  findAll(member: Member) {
    return this.resumeRepository.find({ where: { memberSeq: member.seq } });
  }

  findOne(id: number) {
    return `This action returns a #${id} resume`;
  }

  update(id: number, updateResumeDto: UpdateResumeDto) {
    return `This action updates a #${id} resume`;
  }

  remove(id: number) {
    return `This action removes a #${id} resume`;
  }
}
