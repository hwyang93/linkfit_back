import { Module } from '@nestjs/common';
import { RecruitService } from './recruit.service';
import { RecruitController } from './recruit.controller';
import { Recruit } from '../../entites/Recruit';
import { RecruitDate } from '../../entites/RecruitDate';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RecruitApply } from '../../entites/RecruitApply';
import { RecruitFavorite } from '../../entites/RecruitFavorite';
import { Member } from '../../entites/Member';
import { MemberFavorite } from '../../entites/MemberFavorite';

@Module({
  imports: [TypeOrmModule.forFeature([Recruit, RecruitDate, RecruitApply, RecruitFavorite, Member, MemberFavorite])],
  controllers: [RecruitController],
  providers: [RecruitService]
})
export class RecruitModule {}
