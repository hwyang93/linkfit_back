import { Module } from '@nestjs/common';
import { RecruitService } from './recruit.service';
import { RecruitController } from './recruit.controller';
import {Recruit} from "../entites/Recruit";
import {RecruitDate} from "../entites/RecruitDate";
import {TypeOrmModule} from "@nestjs/typeorm";

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Recruit, RecruitDate
    ]),
  ],
  controllers: [RecruitController],
  providers: [RecruitService]
})
export class RecruitModule {}
