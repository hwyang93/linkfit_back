import { Injectable } from '@nestjs/common';
import { CreateMemberDto } from './dto/create-member.dto';
import { UpdateMemberDto } from './dto/update-member.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import { Member } from '../../entites/Member';
import { RecruitDate } from '../../entites/RecruitDate';
import { Company } from '../../entites/Company';

const bcrypt = require('bcrypt');

@Injectable()
export class MemberService {
  constructor(@InjectRepository(Member) private memberRepository: Repository<Member>, @InjectRepository(Company) private companyRepository: Repository<Company>, private datasource: DataSource) {}
  async join(createMemberDto: CreateMemberDto) {
    const queryRunner = this.datasource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    const member = createMemberDto.toEntity();
    member.password = await bcrypt.hash(createMemberDto.password, 12);

    let savedMember;

    try {
      savedMember = await this.memberRepository.save(member);

      if (member.type === 'company') {
        const company = new Company(createMemberDto.company);
        company.memberSeq = savedMember.seq;

        await this.companyRepository.save(company);
      }

      await queryRunner.commitTransaction();
    } catch (e) {
      await queryRunner.rollbackTransaction();
    } finally {
      await queryRunner.release();
    }
    return { seq: savedMember.seq };
  }

  async getMemberInfo(member: Member) {
    const result = await this.memberRepository.findOne({
      where: { seq: member.seq }
    });
    delete result.password;
    return result;
  }

  async getMemberInfoBySeq(seq: number) {
    const result = await this.memberRepository.findOne({
      where: { seq: seq }
    });
    delete result.password;
    return result;
  }

  async getMemberInfoByEmail(email: string) {
    const member = await this.memberRepository.createQueryBuilder('member').where('member.email = :email', { email: email }).getOne();
    return { seq: member?.seq };
  }

  findOne(id: number) {
    return `This action returns a #${id} member`;
  }

  update(id: number, updateMemberDto: UpdateMemberDto) {
    return `This action updates a #${id} member`;
  }

  remove(id: number) {
    return `This action removes a #${id} member`;
  }
}
