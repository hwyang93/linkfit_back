import { Module } from '@nestjs/common';
import { MemberService } from './member.service';
import { MemberController } from './member.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Member } from '../../entites/Member';
import { Company } from '../../entites/Company';
import { MemberLicence } from '../../entites/MemberLicence';
import { RegionAuth } from '../../entites/RegionAuth';
import { RecruitApply } from '../../entites/RecruitApply';
import { PositionSuggest } from '../../entites/PositionSuggest';
import { Resume } from '../../entites/Resume';

@Module({
  imports: [TypeOrmModule.forFeature([Member, Company, MemberLicence, RegionAuth, Resume, RecruitApply, PositionSuggest])],
  controllers: [MemberController],
  providers: [MemberService]
})
export class MemberModule {}
