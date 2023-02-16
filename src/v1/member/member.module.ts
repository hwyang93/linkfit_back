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
import { Recruit } from '../../entites/Recruit';
import { MemberReputation } from '../../entites/MemberReputation';
import { MulterModule } from '@nestjs/platform-express';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { multerOptionsFactory } from '../../common/utils/multer.option';
import { CommonFile } from '../../entites/CommonFile';

@Module({
  imports: [
    // MulterModule.registerAsync({
    //   imports: [ConfigModule],
    //   useFactory: multerOptionsFactory,
    //   inject: [ConfigService]
    // }),
    TypeOrmModule.forFeature([Member, Company, MemberLicence, RegionAuth, Resume, RecruitApply, PositionSuggest, Recruit, MemberReputation, CommonFile])
  ],
  controllers: [MemberController],
  providers: [MemberService]
})
export class MemberModule {}
