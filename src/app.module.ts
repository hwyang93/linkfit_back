import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import {TypeOrmModule} from '@nestjs/typeorm';
import {Member} from './entites/Member';
import {CommonFile} from './entites/CommonFile';
import {Company} from './entites/Company';
import {MemberAlbum} from './entites/MemberAlbum';
import {MemberBlock} from './entites/MemberBlock';
import {MemberLicence} from './entites/MemberLicence';
import {MemberReputation} from './entites/MemberReputation';
import {Career} from './entites/Career';
import {Community} from './entites/Community';
import {CommunityComment} from './entites/CommunityComment';
import {Recruit} from './entites/Recruit';
import {RecruitDate} from './entites/RecruitDate';
import { RecruitModule } from './recruit/recruit.module';
import {MemberLink} from "./entites/MemberLink";
import {Resume} from "./entites/Resume";
import {Cs} from "./entites/Cs";
import {Education} from "./entites/Education";
import {Inquiry} from "./entites/Inquiry";
import {InquiryAnswer} from "./entites/InquiryAnswer";
import {SeekDate} from "./entites/SeekDate";
import {Seek} from "./entites/Seek";

@Module({
  imports: [TypeOrmModule.forRoot({
    type: 'mysql',
    host: '192.168.0.25',
    port: 3306,
    username: 'linkfit',
    password: 'linkfit',
    database: 'linkfit',
    entities: [Member,
      CommonFile,
      Company,
      MemberAlbum,
      MemberBlock,
      MemberLicence,
      MemberReputation,
      MemberLink,
      Career,
      Community,
      CommunityComment,
      Cs,
      Education,
      Inquiry,
      InquiryAnswer,
      Recruit,
      RecruitDate,
      Resume,
      Seek,
      SeekDate,],
    charset: 'utf8mb4',
    synchronize: false,
    logging: true,
    keepConnectionAlive: true
  }), RecruitModule, ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
