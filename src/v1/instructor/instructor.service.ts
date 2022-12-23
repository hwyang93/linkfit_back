import { Injectable } from '@nestjs/common';
import { CreateInstructorDto } from './dto/create-instructor.dto';
import { UpdateInstructorDto } from './dto/update-instructor.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Member } from '../../entites/Member';
import { Repository } from 'typeorm';

@Injectable()
export class InstructorService {
  constructor(@InjectRepository(Member) private memberRepository: Repository<Member>) {}

  getInstructorList() {
    return `This action returns all instructor`;
  }
}
