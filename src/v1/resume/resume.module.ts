import { Module } from '@nestjs/common';
import { ResumeService } from './resume.service';
import { ResumeController } from './resume.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Resume } from '../../entites/Resume';
import { Career } from '../../entites/Career';
import { Education } from '../../entites/Education';

@Module({
  imports: [TypeOrmModule.forFeature([Resume, Career, Education])],
  controllers: [ResumeController],
  providers: [ResumeService]
})
export class ResumeModule {}
