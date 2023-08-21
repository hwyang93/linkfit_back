import { BadRequestException, ForbiddenException, Injectable, InternalServerErrorException, NotFoundException, UnauthorizedException } from '@nestjs/common';
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
import { SearchSuggestDto } from './dto/search-suggest.dto';
import { SearchLicenceDto } from './dto/search-licence.dto';
import { UpdateMemberPasswordDto } from './dto/update-member-password.dto';
import { MemberAlbum } from '../../entites/MemberAlbum';

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
    @InjectRepository(MemberFavorite) private memberFavoriteRepository: Repository<MemberFavorite>,
    @InjectRepository(CommonFile) private commonFileRepository: Repository<CommonFile>,
    @InjectRepository(MemberAlbum) private memberAlbumRepository: Repository<MemberAlbum>,
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
      .leftJoinAndSelect('member.profileImage', 'profileImage')
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

    const masterResume = await this.resumeRepository
      .createQueryBuilder('resume')
      .leftJoinAndSelect('resume.careers', 'careers')
      .where('resume.writerSeq = :writerSeq', { writerSeq: member.seq })
      .andWhere('resume.isMaster="Y"')
      .getOne();
    const career = calcCareer(masterResume?.careers);

    return { ...result.entities[0], followerCount: result.raw[0]?.followerCount, career: career };
  }

  async getMemberMyCompany(member: Member) {
    const result = {
      memberInfo: {},
      suggestCountInfo: {},
      recruitCountInfo: {}
    };
    result.memberInfo = await this.getMemberInfo(member);

    result.suggestCountInfo = await this.positionSuggestRepository
      .createQueryBuilder('positionSuggest')
      .select('COUNT(*)', 'totalSuggestCount')
      .addSelect('COUNT(CASE WHEN positionSuggest.status = "WAITING" THEN 1 END)', 'waitingSuggestCount')
      .addSelect('COUNT(CASE WHEN positionSuggest.status = "ACCEPT" OR positionSuggest.status = "REJECT" THEN 1 END)', 'completedSuggestCount')
      .addSelect('COUNT(CASE WHEN positionSuggest.status = "CLOSED" THEN 1 END)', 'closedSuggestCount')
      .where('positionSuggest.suggestMemberSeq = :memberSeq', { memberSeq: member.seq })
      .getRawOne();

    result.recruitCountInfo = await this.recruitRepository
      .createQueryBuilder('recruit')
      .select('COUNT(CASE WHEN recruit.status = "ING" THEN 1 END)', 'ingRecruitCount')
      .addSelect('COUNT(CASE WHEN recruit.status != "ING" THEN 1 END)', 'closedRecruitCount')
      .where('recruit.writerSeq = :memberSeq', { memberSeq: member.seq })
      .getRawOne();

    return result;
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
      .addSelect('COUNT(CASE WHEN positionSuggest.status = "ACCEPT" OR positionSuggest.status = "REJECT" THEN 1 END)', 'completedSuggestCount')
      .addSelect('COUNT(CASE WHEN positionSuggest.status = "CLOSED" THEN 1 END)', 'closedSuggestCount')
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

  async getSuggestToList(searchParams: SearchSuggestDto, member: Member) {
    const positionSuggest = await this.positionSuggestRepository
      .createQueryBuilder('positionSuggest')
      .innerJoinAndSelect('positionSuggest.writer', 'writer')
      .leftJoinAndSelect('writer.company', 'company')
      .where('positionSuggest.targetMemberSeq = :memberSeq', { memberSeq: member.seq });

    if (searchParams.period) {
    }
    if (searchParams.status) {
      positionSuggest.andWhere('recruitApply.status = :status', { status: searchParams.status });
    }
    return positionSuggest.getMany();
  }

  async getSuggestFromList(searchParams: SearchSuggestDto, member: Member) {
    const positionSuggest = await this.positionSuggestRepository
      .createQueryBuilder('positionSuggest')
      .innerJoinAndSelect('positionSuggest.writer', 'writer')
      .leftJoinAndSelect('writer.company', 'company')
      .where('positionSuggest.suggestMemberSeq = :memberSeq', { memberSeq: member.seq });
    if (searchParams.period) {
    }
    if (searchParams.status) {
      positionSuggest.andWhere('recruitApply.status = :status', { status: searchParams.status });
    }
    return positionSuggest.getMany();
  }

  async updatePositionSuggestStatus(seq: number, updatePositionSuggestDto: UpdatePositionSuggestDto, member: Member) {
    const positionSuggest = await this.positionSuggestRepository.createQueryBuilder('positionSuggest').where({ seq }).getOne();
    if (positionSuggest.suggestMemberSeq !== member.seq && positionSuggest.targetMemberSeq !== member.seq) {
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
      .leftJoinAndSelect(Recruit, 'recruit', 'recruit.seq = positionSuggest.recruitSeq')
      .where('positionSuggest.seq = :seq', { seq })
      .getOne();

    const recruit = await this.recruitRepository.createQueryBuilder('recruit').where('recruit.seq = :recruitSeq', { recruitSeq: positionSuggest.recruitSeq }).getOne();

    if (positionSuggest.suggestMemberSeq !== member.seq && positionSuggest.targetMemberSeq !== member.seq) {
      throw new UnauthorizedException('허용되지 않은 접근입니다.');
    }

    return { ...positionSuggest, recruit: recruit };
  }

  async updateMemberProfile(updateMemberProfileDto: UpdateMemberProfileDto, file: Express.MulterS3.File, member: Member) {
    const memberInfo = await this.getMemberInfo(member);
    const { duplication } = await this.checkMemberNickname(updateMemberProfileDto.nickname);

    if (memberInfo.nickname !== updateMemberProfileDto.nickname && duplication) {
      throw new ForbiddenException('이미 사용중인 닉네임입니다.');
    }
    let savedCommonFile;
    const queryRunner = this.datasource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();
    try {
      if (file) {
        const location = file.location;
        const commonFile = new CommonFile();
        commonFile.memberSeq = member.seq;
        commonFile.originFileName = file.originalname;
        commonFile.originFileUrl = location;
        savedCommonFile = await queryRunner.manager.getRepository(CommonFile).save(commonFile);
        await queryRunner.manager.update(Member, { seq: member.seq }, { profileFileSeq: savedCommonFile.seq });
      }
      await queryRunner.manager.update(Member, { seq: member.seq }, { nickname: updateMemberProfileDto.nickname, intro: updateMemberProfileDto.intro, field: updateMemberProfileDto.field });
      // for (const link of updateMemberProfileDto.links) {
      //   if (link.seq) {
      //     await queryRunner.manager.delete(MemberLink, { seq: link.seq });
      //   } else {
      //     const saveLink = new MemberLink();
      //     saveLink.memberSeq = member.seq;
      //     saveLink.type = link.type;
      //     saveLink.url = link.url;
      //     await queryRunner.manager.insert(MemberLink, saveLink);
      //   }
      // }

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

  getMemberLicenceList(searchParams: SearchLicenceDto, member: Member) {
    const memberLicences = this.memberLicenceRepository.createQueryBuilder('memberLicence').where('memberLicence.memberSeq = :memberSeq', { memberSeq: member.seq });
    if (searchParams.status) {
      memberLicences.andWhere('memberLicence.status = :status', { status: searchParams.status });
    }
    return memberLicences.orderBy('memberLicence.createdAt', 'DESC').getMany();
  }

  async updateMemberLicence(seq: number, member: Member) {
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
      // await queryRunner.manager.getRepository(MemberLicence).softDelete({ seq });
      await queryRunner.manager.getRepository(MemberLicence).update({ seq }, { status: 'CANCEL' });
      await queryRunner.commitTransaction();
    } catch (e) {
      console.log(e);
      await queryRunner.rollbackTransaction();
    } finally {
      await queryRunner.release();
    }
    return { seq };
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

  async updateMemberPassword(updateMemberPasswordDto: UpdateMemberPasswordDto, member: Member) {
    const memberInfo = await this.memberRepository.createQueryBuilder('member').where('member.seq = :seq', { seq: member.seq }).addSelect('member.password').getOne();
    const passwordCompareResult = await bcrypt.compare(updateMemberPasswordDto.password, memberInfo.password);

    if (!passwordCompareResult) {
      throw new UnauthorizedException('일치하지 않은 비밀번호 입니다.');
    }

    const encryptedNewPassword = await bcrypt.hash(updateMemberPasswordDto.newPassword, 12);

    await this.memberRepository.createQueryBuilder('member').update().set({ password: encryptedNewPassword }).where({ seq: member.seq }).execute();

    return { seq: member.seq };
  }

  async createMemberPortfolio(file: Express.MulterS3.File, member: Member) {
    const queryRunner = this.datasource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    let savedMemberAlbum;
    let savedCommonFile;

    try {
      if (file) {
        const location = file.location;
        const commonFile = new CommonFile();
        commonFile.memberSeq = member.seq;
        commonFile.originFileName = file.originalname;
        commonFile.originFileUrl = location;
        savedCommonFile = await queryRunner.manager.getRepository(CommonFile).save(commonFile);

        const memberAlbum = new MemberAlbum();
        memberAlbum.memberSeq = member.seq;
        memberAlbum.albumFileSeq = savedCommonFile.seq;
        savedMemberAlbum = await queryRunner.manager.getRepository(MemberAlbum).save(memberAlbum);
      }
      await queryRunner.commitTransaction();
    } catch (e) {
      console.log(e);
      await queryRunner.rollbackTransaction();
    } finally {
      await queryRunner.release();
    }
    return { seq: savedMemberAlbum.seq };
  }

  async getMemberPortfolio(member: Member) {
    const result = await this.commonFileRepository
      .createQueryBuilder('commonFile')
      .where(qb => {
        const sq = qb.subQuery().select('memberAlbum.albumFileSeq', 'albumFileSeq').from(MemberAlbum, 'memberAlbum').where('memberAlbum.memberSeq = :memberSeq', { memberSeq: member.seq }).getQuery();
        return 'commonFile.seq IN ' + sq;
      })
      .getMany();
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

  getMemberReputation(member: Member) {
    return this.memberReputationRepository
      .createQueryBuilder('memberReputation')
      .leftJoinAndSelect('memberReputation.targetMember', 'targetMember')
      .leftJoinAndSelect('targetMember.company', 'company')
      .leftJoinAndSelect('targetMember.profileImage', 'profileImage')
      .where('memberReputation.evaluationMemberSeq = :memberSeq', { memberSeq: member.seq })
      .andWhere('memberReputation.type="SEEK"')
      .orderBy('memberReputation.updatedAt', 'DESC')
      .getMany();
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
    memberReputation.type = 'SEEK';
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

    await this.memberReputationRepository.createQueryBuilder('memberReputation').softDelete().where({ seq }).execute();

    return { seq };
  }

  async getMemberFollowingsInstructor(type: string, member: Member) {
    const followings = await this.memberFavoriteRepository
      .createQueryBuilder('memberFavorite')
      .leftJoinAndSelect('memberFavorite.followingMember', 'followingMember')
      .leftJoinAndSelect('followingMember.company', 'company')
      .leftJoinAndSelect('followingMember.profileImage', 'profileImage')
      .leftJoinAndSelect('followingMember.resumes', 'resumes')
      .leftJoinAndSelect('resumes.careers', 'careers')
      .leftJoinAndSelect(
        sq => {
          return sq
            .select('memberFavorite.favoriteSeq', 'favoriteSeq')
            .addSelect('COUNT(memberFavorite.favoriteSeq)', 'followerCount')
            .from(MemberFavorite, 'memberFavorite')
            .groupBy('memberFavorite.favoriteSeq');
        },
        'follower',
        'followingMember.seq = follower.favoriteSeq'
      )
      .where('memberFavorite.memberSeq = :memberSeq', { memberSeq: member.seq })
      .andWhere('followingMember.type = :type', { type })
      .andWhere('resumes.isMaster = :isMaster', { isMaster: 'Y' })
      .select()
      .getRawAndEntities();

    const result = [];
    followings.entities.forEach(item => {
      const career = calcCareer(item.followingMember.resumes[0].careers);
      item.followingMember['followerCount'] = followings.raw.find(raw => {
        return raw.favoriteSeq === item.favoriteSeq;
      })?.followerCount;
      result.push({
        ...item,
        career: career
      });
    });
    return result;
  }

  async getMemberFollowingsCompany(type: string, member: Member) {
    return await this.memberFavoriteRepository
      .createQueryBuilder('memberFavorite')
      .leftJoinAndSelect('memberFavorite.followingMember', 'followingMember')
      .leftJoinAndSelect('followingMember.company', 'company')
      .leftJoinAndSelect('followingMember.profileImage', 'profileImage')
      .where('memberFavorite.memberSeq = :memberSeq', { memberSeq: member.seq })
      .andWhere('followingMember.type = :type', { type })
      .getMany();
  }

  getRecruitByMember(seq: number) {
    return this.recruitRepository
      .createQueryBuilder('recruit')
      .leftJoinAndSelect('recruit.dates', 'dates')
      .where('recruit.writerSeq = :writerSeq', { writerSeq: seq })
      .andWhere('recruit.status = "ING"')
      .getMany();
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
