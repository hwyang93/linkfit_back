import { Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Cs } from '../../entites/Cs';
import { SearchCsDto } from './dto/search-cs.dto';
import { Inquiry } from '../../entites/Inquiry';
import { CreateInquiryDto } from './dto/create-inquiry.dto';
import { Member } from '../../entites/Member';
import { UpdateInquiryDto } from './dto/update-inquiry.dto';

@Injectable()
export class CsService {
  constructor(@InjectRepository(Cs) private csRepository: Repository<Cs>, @InjectRepository(Inquiry) private inquiryRepository: Repository<Inquiry>) {}

  async getInquiryItems() {}

  async createInquiry(createInquiryDto: CreateInquiryDto, member: Member) {
    const inquiry = createInquiryDto.toEntity();

    inquiry.writerSeq = member.seq;
    inquiry.status = 'WAITING';

    const savedInquiry = await this.inquiryRepository.save(inquiry);
    return { seq: savedInquiry.seq };
  }

  async getInquiryList(member: Member) {
    return await this.inquiryRepository.createQueryBuilder('inquiry').where('inquiry.writerSeq = :memberSeq', { memberSeq: member.seq }).orderBy('inquiry.updatedAt', 'DESC').getMany();
  }

  async getInquiry(seq: number, member: Member) {
    const inquiry = await this.inquiryRepository.createQueryBuilder('inquiry').where('inquiry.seq = :seq', { seq }).getOne();

    if (!inquiry) {
      throw new NotFoundException('게시글이 존재하지 않습니다.');
    }

    if (inquiry.writerSeq !== member.seq) {
      throw new UnauthorizedException('허용되지 않은 접근입니다.');
    }

    return inquiry;
  }

  async updateInquiry(seq: number, updateInquiryDto: UpdateInquiryDto, member: Member) {
    const inquiry = await this.inquiryRepository.createQueryBuilder('inquiry').where('inquiry.seq = :seq', { seq }).getOne();
    if (inquiry.writerSeq !== member.seq) {
      throw new UnauthorizedException('허용되지 않은 접근입니다.');
    }

    await this.inquiryRepository.createQueryBuilder('inquiry').update().set({ title: updateInquiryDto.title, contents: updateInquiryDto.contents }).where({ seq: seq }).execute();
    return { seq };
  }

  async deleteInquiry(seq: number, member: Member) {
    const inquiry = await this.inquiryRepository.createQueryBuilder('inquiry').where('inquiry.seq = :seq', { seq }).getOne();

    if (inquiry.writerSeq !== member.seq) {
      throw new UnauthorizedException('허용되지 않은 접근입니다.');
    }

    await this.inquiryRepository.delete(seq);

    return { seq };
  }

  async getCsList(searchParam: SearchCsDto) {
    return await this.csRepository.createQueryBuilder('cs').where('cs.type = :type', { type: searchParam.type }).orderBy('cs.updatedAt', 'DESC').getMany();
  }

  async getCs(seq: number) {
    return await this.csRepository.createQueryBuilder('cs').where('cs.seq = :seq', { seq }).getOne();
  }
}
