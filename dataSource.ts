import { DataSource } from 'typeorm';
import { Member } from './src/entites/Member';
import { CommonFile } from './src/entites/CommonFile';
import { Company } from './src/entites/Company';
import { MemberAlbum } from './src/entites/MemberAlbum';
import { MemberBlock } from './src/entites/MemberBlock';
import { MemberLicence } from './src/entites/MemberLicence';
import { MemberReputation } from './src/entites/MemberReputation';
import { MemberLink } from './src/entites/MemberLink';
import { Career } from './src/entites/Career';
import { Community } from './src/entites/Community';
import { CommunityComment } from './src/entites/CommunityComment';
import { Cs } from './src/entites/Cs';
import { Education } from './src/entites/Education';
import { Inquiry } from './src/entites/Inquiry';
import { InquiryAnswer } from './src/entites/InquiryAnswer';
import { Recruit } from './src/entites/Recruit';
import { RecruitDate } from './src/entites/RecruitDate';
import { Resume } from './src/entites/Resume';
import { Seek } from './src/entites/Seek';
import { SeekDate } from './src/entites/SeekDate';
import { EmailAuth } from './src/entites/EmailAuth';

const dataSource = new DataSource({
  type: 'mysql',
  host: process.env.DB_HOST,
  port: +process.env.DB_PORT,
  username: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE,
  entities: [
    Member,
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
    SeekDate,
    EmailAuth
  ],
  migrations: [__dirname + '/src/migrations/*.ts'],
  charset: 'utf8mb4',
  synchronize: false,
  logging: true
});

export default dataSource;
