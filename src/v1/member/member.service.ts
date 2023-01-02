import { Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { CreateMemberDto } from './dto/create-member.dto';
import { UpdateMemberDto } from './dto/update-member.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import { Member } from '../../entites/Member';
import { RecruitDate } from '../../entites/RecruitDate';
import { Company } from '../../entites/Company';
import { CreateMemberLicenceDto } from './dto/create-member-licence.dto';
import { MemberLicence } from '../../entites/MemberLicence';
import { CreateRegionAuthDto } from './dto/create-region-auth.dto';
import { RegionAuth } from '../../entites/RegionAuth';

const bcrypt = require('bcrypt');

@Injectable()
export class MemberService {
  constructor(
    @InjectRepository(Member) private memberRepository: Repository<Member>,
    @InjectRepository(Company) private companyRepository: Repository<Company>,
    @InjectRepository(MemberLicence) private memberLicenceRepository: Repository<MemberLicence>,
    @InjectRepository(RegionAuth) private regionAuthRepository: Repository<RegionAuth>,
    private datasource: DataSource
  ) {}
  async join(createMemberDto: CreateMemberDto) {
    const queryRunner = this.datasource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    const member = createMemberDto.toEntity();
    member.password = await bcrypt.hash(createMemberDto.password, 12);

    let savedMember;

    try {
      savedMember = await this.memberRepository.save(member);

      if (member.type === 'COMPANY') {
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

  async createMemberLicence(createMemberLicenceDto: CreateMemberLicenceDto, member: Member) {
    const memberLicence = createMemberLicenceDto.toEntity();
    memberLicence.memberSeq = member.seq;
    memberLicence.status = 'process';

    const queryRunner = this.datasource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    let savedMemberLicence;

    try {
      savedMemberLicence = await queryRunner.manager.getRepository(MemberLicence).save(memberLicence);
      await queryRunner.commitTransaction();
    } catch (e) {
      console.log(e);
      await queryRunner.rollbackTransaction();
    } finally {
      await queryRunner.release();
    }
    return { seq: savedMemberLicence.seq };
  }

  getMemberLicenceList(member: Member) {
    return this.memberLicenceRepository.createQueryBuilder('memberLicence').where('memberLicence.memberSeq = :memberSeq', { memberSeq: member.seq }).getMany();
  }

  async deleteMemberLicence(seq: number, member: Member) {
    const memberLicence = await this.getMemberLicenceInfo(seq);
    if (!memberLicence) {
      throw new NotFoundException('존재하지 않는 리소스입니다.');
    }
    if (memberLicence.memberSeq !== member.seq) {
      throw new UnauthorizedException('허용되지 않은 접근입니다.');
    }

    const queryRunner = this.datasource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      await queryRunner.manager.getRepository(MemberLicence).softDelete({ seq });
      await queryRunner.commitTransaction();
    } catch (e) {
      console.log(e);
      await queryRunner.rollbackTransaction();
    } finally {
      await queryRunner.release();
    }
    return { seq: seq };
  }

  async getMemberLicenceInfo(seq: number) {
    return this.memberLicenceRepository.createQueryBuilder('memberLicence').where({ seq }).getOne();
  }

  async getMemberInfoBySeq(seq: number) {
    const result = await this.memberRepository.createQueryBuilder('member').leftJoinAndSelect('member.company', 'company').where({ seq }).getOne();

    // const result = await this.memberRepository.findOne({
    //   where: { seq: seq }
    // });
    delete result.password;
    return result;
  }

  async getMemberInfoByEmail(email: string) {
    const member = await this.memberRepository.createQueryBuilder('member').where('member.email = :email', { email: email }).getOne();
    return { seq: member?.seq };
  }

  async createRegionAuth(createRegionAuthDto: CreateRegionAuthDto, member: Member) {
    const regionAuth = createRegionAuthDto.toEntity();
    regionAuth.memberSeq = member.seq;

    const existRegionAuth = await this.regionAuthRepository.createQueryBuilder('regionAuth').where({ memberSeq: member.seq }).getOne();

    if (existRegionAuth) {
      await this.regionAuthRepository.createQueryBuilder('regionAuth').delete().where({ seq: existRegionAuth.seq }).execute();
    }

    const savedRegionAuth = await this.regionAuthRepository.save(regionAuth);

    await this.memberRepository.createQueryBuilder('member').update().set({ updateAt: new Date() }).where({ seq: member.seq }).execute();

    return { seq: savedRegionAuth.seq };
  }

  async deleteRegionAuth(seq: number, member: Member) {
    const regionAuth = await this.regionAuthRepository.createQueryBuilder('regionAuth').where({ seq }).getOne();

    if (regionAuth.memberSeq !== member.seq) {
      throw new UnauthorizedException('허용되지 않은 접근입니다.');
    }
    await this.regionAuthRepository.createQueryBuilder('regionAuth').delete().where({ seq }).execute();

    return { seq };
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
