import { Module } from '@nestjs/common';
import { MemberService } from './member.service';
import { MemberController } from './member.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Member } from '../../entites/Member';
import { Company } from '../../entites/Company';
import { MemberLicence } from '../../entites/MemberLicence';

@Module({
  imports: [TypeOrmModule.forFeature([Member, Company, MemberLicence])],
  controllers: [MemberController],
  providers: [MemberService]
})
export class MemberModule {}
