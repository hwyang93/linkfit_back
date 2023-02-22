import { ForbiddenException, Injectable, InternalServerErrorException, UnauthorizedException } from '@nestjs/common';
import { CreateResumeDto } from './dto/create-resume.dto';
import { UpdateResumeDto } from './dto/update-resume.dto';
import { Member } from '../../entites/Member';
import { InjectRepository } from '@nestjs/typeorm';
import { Recruit } from '../../entites/Recruit';
import { DataSource, Repository } from 'typeorm';
import { Resume } from '../../entites/Resume';
import { Career } from '../../entites/Career';
import { Education } from '../../entites/Education';
import { UpdateResumeMasterDto } from './dto/update-resume-master.dto';

@Injectable()
export class ResumeService {
  constructor(
    @InjectRepository(Resume) private resumeRepository: Repository<Resume>,
    @InjectRepository(Career) private careerRepository: Repository<Career>,
    @InjectRepository(Education) private educationRepository: Repository<Education>,
    private datasource: DataSource
  ) {}
  async create(createResumeDto: CreateResumeDto, member: Member) {
    const resume = createResumeDto.toEntity();
    resume.writerSeq = member.seq;

    const myResumeList = await this.getResumeList(member);

    if (myResumeList.length === 0) {
      resume.isMaster = 'Y';
    }

    const queryRunner = this.datasource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();
    let savedResume;
    try {
      savedResume = await queryRunner.manager.getRepository(Resume).save(resume);

      if (createResumeDto.careers.length > 0) {
        for (const item of createResumeDto.careers) {
          const career = new Career();
          career.companyName = item.companyName;
          career.startDate = item.startDate;
          career.endDate = item.endDate;
          career.workType = item.workType;
          career.field = item.field;
          career.content = item.content;
          career.resumeSeq = savedResume.seq;
          career.writerSeq = member.seq;

          await queryRunner.manager.getRepository(Career).save(career);
        }
      }

      if (createResumeDto.educations.length > 0) {
        for (const item of createResumeDto.educations) {
          const education = new Education();
          education.school = item.school;
          education.major = item.major;
          education.startDate = item.startDate;
          education.endDate = item.endDate;
          education.status = item.status;
          education.resumeSeq = savedResume.seq;
          education.writerSeq = member.seq;

          await queryRunner.manager.getRepository(Education).save(education);
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

    return { seq: savedResume.seq };
  }

  async getResumeList(member: Member) {
    return await this.resumeRepository.find({ where: { writerSeq: member.seq } });
  }

  getResume(seq: number) {
    return this.resumeRepository
      .createQueryBuilder('resume')
      .where('resume.seq=:seq', { seq: seq })
      .leftJoinAndSelect('resume.careers', 'careers')
      .leftJoinAndSelect('resume.educations', 'educations')
      .getOne();
  }

  async setMasterResume(seq: number, member: Member) {
    const queryRunner = this.datasource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();
    try {
      await queryRunner.manager.update(Resume, { writerSeq: member.seq }, { isMaster: 'N' });
      await queryRunner.manager.update(Resume, { seq: seq }, { isMaster: 'Y' });
      await queryRunner.commitTransaction();
    } catch (e) {
      console.log(e);
      await queryRunner.rollbackTransaction();
      throw new InternalServerErrorException('서버에서 에러가 발생했습니다.');
    } finally {
      await queryRunner.release();
    }
    return { seq: seq };
  }

  async setOpenResume(seq: number, updateResumeMasterDto: UpdateResumeMasterDto, member: Member) {
    const resume = await this.getResume(seq);
    if (resume.writerSeq !== member.seq) {
      throw new UnauthorizedException('허용되지 않은 접근입니다.');
    }
    if (resume.isMaster === 'N') {
      throw new ForbiddenException('대표 이력서만 공개여부를 설정 할 수 있습니다.');
    }
    await this.resumeRepository.update({ seq }, { isOpen: updateResumeMasterDto.isOpen });
    return { seq: seq };
  }

  update(id: number, updateResumeDto: UpdateResumeDto) {
    return `This action updates a #${id} resume`;
  }

  async deleteResume(seq: number, member: Member) {
    const resume = await this.getResume(seq);
    if (resume.writerSeq !== member.seq) {
      throw new UnauthorizedException('허용되지 않은 접근입니다.');
    }
    await this.resumeRepository.createQueryBuilder('resume').softDelete().where({ seq }).execute();
    // const resumes = await this.getResumeList(member);

    return { seq };
  }
}
