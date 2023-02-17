import { BadRequestException, Body, ForbiddenException, Injectable, InternalServerErrorException, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { CreateMemberDto } from './dto/create-member.dto';
import { UpdateMemberDto } from './dto/update-member.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import { Member } from '../../entites/Member';
import { Company } from '../../entites/Company';
import { CreateMemberLicenceDto } from './dto/create-member-licence.dto';
import { MemberLicence } from '../../entites/MemberLicence';
import { CreateRegionAuthDto } from './dto/create-region-auth.dto';
import { RegionAuth } from '../../entites/RegionAuth';
import { UpdateMemberProfileDto } from './dto/update-member-profile.dto';
import { MemberLink } from '../../entites/MemberLink';
import { RecruitApply } from '../../entites/RecruitApply';
import { PositionSuggest } from '../../entites/PositionSuggest';
import { Resume } from '../../entites/Resume';
import { UpdatePositionSuggestDto } from './dto/update-position-suggest.dto';
import { Recruit } from '../../entites/Recruit';
import { CreateMemberReputationDto } from './dto/create-member-reputation.dto';
import { MemberReputation } from '../../entites/MemberReputation';
import { UpdateMemberReputationDto } from './dto/update-member-reputation.dto';
import { MemberFavorite } from '../../entites/MemberFavorite';
import { calcCareer } from '../../common/utils/utils';
import { CommonFile } from '../../entites/CommonFile';

const bcrypt = require('bcrypt');

@Injectable()
export class MemberService {
  constructor(
    @InjectRepository(Member) private memberRepository: Repository<Member>,
    @InjectRepository(Company) private companyRepository: Repository<Company>,
    @InjectRepository(MemberLicence) private memberLicenceRepository: Repository<MemberLicence>,
    @InjectRepository(RegionAuth) private regionAuthRepository: Repository<RegionAuth>,
    @InjectRepository(Resume) private resumeRepository: Repository<Resume>,
    @InjectRepository(RecruitApply) private recruitApplyRepository: Repository<RecruitApply>,
    @InjectRepository(PositionSuggest) private positionSuggestRepository: Repository<PositionSuggest>,
    @InjectRepository(Recruit) private recruitRepository: Repository<Recruit>,
    @InjectRepository(MemberReputation) private memberReputationRepository: Repository<MemberReputation>,
    @InjectRepository(CommonFile) private commonFileRepository: Repository<CommonFile>,
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
    const result = await this.memberRepository
      .createQueryBuilder('member')
      .leftJoinAndSelect('member.company', 'company')
      .leftJoinAndSelect('member.links', 'links')
      .leftJoinAndSelect('member.licences', 'licences', 'licences.status="APPROVAL"')
      .leftJoinAndSelect(
        sq => {
          return sq
            .select('memberFavorite.favoriteSeq', 'favoriteSeq')
            .addSelect('COUNT(memberFavorite.favoriteSeq)', 'followerCount')
            .from(MemberFavorite, 'memberFavorite')
            .groupBy('memberFavorite.favoriteSeq');
        },
        'follower',
        'member.seq = follower.favoriteSeq'
      )
      .where('member.seq = :seq', { seq: member.seq })
      .addSelect('IFNULL(follower.followerCount, 0)', 'followerCount')
      .getRawAndEntities();
    return { ...result.entities[0], followerCount: result.raw[0]?.followerCount };
  }
  async getMemberMy(member: Member) {
    const result = {
      memberInfo: {},
      masterResume: {},
      applyCountInfo: {},
      suggestCountInfo: {},
      noticeCountInfo: {}
    };
    const memberInfo = await this.getMemberInfo(member);

    const masterResume = await this.resumeRepository
      .createQueryBuilder('resume')
      .leftJoinAndSelect('resume.careers', 'careers')
      .where('resume.writerSeq = :writerSeq', { writerSeq: member.seq })
      .andWhere('resume.isMaster="Y"')
      .getOne();
    result.applyCountInfo = await this.recruitApplyRepository
      .createQueryBuilder('recruitApply')
      .select('COUNT(*)', 'totalApplyCount')
      .addSelect('COUNT(CASE WHEN recruitApply.status = "PASS" THEN 1 END)', 'passApplyCount')
      .addSelect('COUNT(CASE WHEN recruitApply.status = "FAIL" THEN 1 END)', 'failApplyCount')
      .addSelect('COUNT(CASE WHEN recruitApply.status = "CANCEL" THEN 1 END)', 'cancelApplyCount')
      .where('recruitApply.memberSeq = :memberSeq', { memberSeq: member.seq })
      .getRawOne();

    result.suggestCountInfo = await this.positionSuggestRepository
      .createQueryBuilder('positionSuggest')
      .select('COUNT(*)', 'totalSuggestCount')
      .addSelect('COUNT(CASE WHEN positionSuggest.status = "WAITING" THEN 1 END)', 'waitingSuggestCount')
      .addSelect('COUNT(CASE WHEN positionSuggest.status = "COMPLETE" THEN 1 END)', 'completeSuggestCount')
      .addSelect('COUNT(CASE WHEN positionSuggest.status = "CLOSE" THEN 1 END)', 'closeSuggestCount')
      .where('positionSuggest.targetMemberSeq = :memberSeq', { memberSeq: member.seq })
      .getRawOne();
    result.noticeCountInfo = await this.datasource
      .createQueryBuilder()
      .select('recruitCount', 'totalNoticeCount')
      .addSelect('recruitCount', 'recruitCount')
      .addSelect('"준비중"', 'seekCount')
      .from(sq => {
        return sq.select('COUNT(*)', 'recruitCount').from(Recruit, 'recruit').where('recruit.writerSeq = :writerSeq', { writerSeq: member.seq });
      }, 'recruit')
      .getRawOne();

    const career = calcCareer(masterResume?.careers);

    result.memberInfo = { ...memberInfo, career: career };

    result.masterResume = { ...masterResume };

    return result;
  }

  async checkMemberNickname(nickname: string) {
    const checkNickname = await this.memberRepository.createQueryBuilder('member').where('member.nickname = :nickname', { nickname: nickname }).getOne();
    if (checkNickname) {
      return { duplication: true };
    }
    return { duplication: false };
  }

  async getSuggestToList(member: Member) {
    return await this.positionSuggestRepository
      .createQueryBuilder('positionSuggest')
      .innerJoinAndSelect('positionSuggest.writer', 'writer')
      .leftJoinAndSelect('writer.company', 'company')
      .where('positionSuggest.targetMemberSeq = :memberSeq', { memberSeq: member.seq })
      .getMany();
  }

  async getSuggestFromList(member: Member) {
    return await this.positionSuggestRepository
      .createQueryBuilder('positionSuggest')
      .innerJoinAndSelect('positionSuggest.writer', 'writer')
      .leftJoinAndSelect('writer.company', 'company')
      .where('positionSuggest.suggestMemberSeq = :memberSeq', { memberSeq: member.seq })
      .getMany();
  }

  async updatePositionSuggestStatus(seq: number, updatePositionSuggestDto: UpdatePositionSuggestDto, member: Member) {
    const positionSuggest = await this.positionSuggestRepository.createQueryBuilder('positionSuggest').where({ seq }).getOne();
    if (positionSuggest.suggestMemberSeq !== member.seq || positionSuggest.targetMemberSeq !== member.seq) {
      throw new UnauthorizedException('허용되지 않은 접근입니다.');
    }
    await this.positionSuggestRepository.createQueryBuilder('positionSuggest').update().set({ status: updatePositionSuggestDto.status }).where({ seq }).execute();
    return { seq };
  }

  async getPositionSuggest(seq: number, member: Member) {
    const positionSuggest = await this.positionSuggestRepository
      .createQueryBuilder('positionSuggest')
      .innerJoinAndSelect('positionSuggest.writer', 'writer')
      .leftJoinAndSelect('writer.company', 'company')
      .where('positionSuggest.seq = :seq', { seq: seq })
      .getOne();

    if (positionSuggest.suggestMemberSeq !== member.seq || positionSuggest.targetMemberSeq !== member.seq) {
      throw new UnauthorizedException('허용되지 않은 접근입니다.');
    }

    return positionSuggest;
  }

  async updateMemberProfile(updateMemberProfileDto: UpdateMemberProfileDto, member: Member) {
    const { duplication } = await this.checkMemberNickname(updateMemberProfileDto.nickname);

    if (duplication) {
      throw new ForbiddenException('이미 사용중인 닉네임입니다.');
    }

    const queryRunner = this.datasource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();
    try {
      await queryRunner.manager.update(Member, { seq: member.seq }, { nickname: updateMemberProfileDto.nickname, intro: updateMemberProfileDto.intro, field: updateMemberProfileDto.field });
      for (const link of updateMemberProfileDto.links) {
        if (link.seq) {
          await queryRunner.manager.delete(MemberLink, { seq: link.seq });
        } else {
          const saveLink = new MemberLink();
          saveLink.memberSeq = member.seq;
          saveLink.type = link.type;
          saveLink.url = link.url;
          await queryRunner.manager.insert(MemberLink, saveLink);
        }
      }

      await queryRunner.commitTransaction();
    } catch (e) {
      console.log(e);
      await queryRunner.rollbackTransaction();
      throw new InternalServerErrorException('서버에서 에러가 발생했습니다.');
    } finally {
      await queryRunner.release();
    }
    return { seq: member.seq };
  }

  async createMemberLicence(createMemberLicenceDto: CreateMemberLicenceDto, file: Express.MulterS3.File, member: Member) {
    const memberLicence = createMemberLicenceDto.toEntity();
    memberLicence.memberSeq = member.seq;
    memberLicence.status = 'PROCESS';

    const queryRunner = this.datasource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    let savedMemberLicence;
    let savedCommonFile;

    try {
      if (file) {
        const location = file.location;
        const commonFile = new CommonFile();
        commonFile.memberSeq = member.seq;
        commonFile.originFileName = file.originalname;
        commonFile.originFileUrl = location;
        console.log('=========location=============');
        console.log(file);
        savedCommonFile = await queryRunner.manager.getRepository(CommonFile).save(commonFile);
        memberLicence.licenceFileSeq = savedCommonFile.seq;
      }
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
    return result;
  }

  async getMemberInfoByEmail(email: string) {
    const member = await this.memberRepository.createQueryBuilder('member').where('member.email = :email', { email: email }).getOne();
    return { seq: member?.seq };
  }

  async getRegionAuth(member: Member) {
    return await this.regionAuthRepository.createQueryBuilder('regionAuth').where({ memberSeq: member.seq }).getOne();
  }

  async createRegionAuth(createRegionAuthDto: CreateRegionAuthDto, member: Member) {
    const regionAuth = createRegionAuthDto.toEntity();
    regionAuth.memberSeq = member.seq;

    const existRegionAuth = await this.getRegionAuth(member);

    if (existRegionAuth) {
      await this.regionAuthRepository.createQueryBuilder('regionAuth').delete().where({ seq: existRegionAuth.seq }).execute();
    }

    const savedRegionAuth = await this.regionAuthRepository.save(regionAuth);

    await this.memberRepository.createQueryBuilder('member').update().set({ updatedAt: new Date() }).where({ seq: member.seq }).execute();

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

  async createMemberReputation(createMemberReputationDto: CreateMemberReputationDto, member: Member) {
    if (member.seq === createMemberReputationDto.targetMemberSeq) {
      throw new BadRequestException('평가자와 대상자가 동일합니다.');
    }

    const recruit = await this.recruitRepository.createQueryBuilder('recruit').where('recruit.seq = :recruitSeq', { recruitSeq: createMemberReputationDto.recruitSeq }).getOne();
    const recruitApply = await this.recruitApplyRepository
      .createQueryBuilder('recruitApply')
      .where('recruitApply.recruitSeq = :recruitSeq', { recruitSeq: createMemberReputationDto.recruitSeq })
      .andWhere('recruitApply.status = "PASS"')
      .getMany();
    if (!recruit) {
      throw new UnauthorizedException('허용되지 않은 접근입니다.');
    }

    const isPass = recruitApply.find(item => {
      return item.memberSeq === createMemberReputationDto.evaluationMemberSeq || item.memberSeq === createMemberReputationDto.targetMemberSeq;
    });
    const canReputation = !!((recruit.writerSeq === createMemberReputationDto.targetMemberSeq || recruit.writerSeq === createMemberReputationDto.evaluationMemberSeq) && isPass);

    if (!canReputation) {
      throw new UnauthorizedException('평가 권한이 없습니다.');
    }

    const memberReputation = createMemberReputationDto.toEntity();
    const { seq } = await this.memberReputationRepository.save(memberReputation);

    return { seq };
  }

  async updateMemberReputation(seq: number, updateMemberReputationDto: UpdateMemberReputationDto, member: Member) {
    const reputation = await this.memberReputationRepository
      .createQueryBuilder('memberReputation')
      .where({ seq })
      .andWhere('memberReputation.evaluationMemberSeq = :memberSeq', { memberSeq: member.seq })
      .getOne();

    if (!reputation) {
      throw new UnauthorizedException('허용되지 않은 접근입니다.');
    }

    await this.memberReputationRepository.createQueryBuilder('memberReputation').update().set({ comment: updateMemberReputationDto.comment }).where({ seq }).execute();

    return { seq };
  }

  async deleteMemberReputation(seq: number, member: Member) {
    const reputation = await this.memberReputationRepository
      .createQueryBuilder('memberReputation')
      .where({ seq })
      .andWhere('memberReputation.evaluationMemberSeq = :memberSeq', { memberSeq: member.seq })
      .getOne();

    if (!reputation) {
      throw new UnauthorizedException('허용되지 않은 접근입니다.');
    }

    await this.memberReputationRepository.createQueryBuilder('memberReputation').delete().where({ seq }).execute();

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
