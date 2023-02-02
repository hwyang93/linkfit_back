import { Module } from '@nestjs/common';
import { CompanyService } from './company.service';
import { CompanyController } from './company.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Member } from '../entites/Member';
import { MemberReputation } from '../entites/MemberReputation';
import { Company } from '../entites/Company';
import { RecruitFavorite } from '../entites/RecruitFavorite';
import { MemberFavorite } from '../entites/MemberFavorite';
import { Recruit } from '../entites/Recruit';

@Module({
  imports: [TypeOrmModule.forFeature([Member, Company, Recruit, MemberReputation, RecruitFavorite, MemberFavorite])],
  controllers: [CompanyController],
  providers: [CompanyService]
})
export class CompanyModule {}
