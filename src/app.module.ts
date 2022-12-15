import { MiddlewareConsumer, Module, RequestMethod } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Member } from './entites/Member';
import { CommonFile } from './entites/CommonFile';
import { Company } from './entites/Company';
import { MemberAlbum } from './entites/MemberAlbum';
import { MemberBlock } from './entites/MemberBlock';
import { MemberLicence } from './entites/MemberLicence';
import { MemberReputation } from './entites/MemberReputation';
import { Career } from './entites/Career';
import { Community } from './entites/Community';
import { CommunityComment } from './entites/CommunityComment';
import { Recruit } from './entites/Recruit';
import { RecruitDate } from './entites/RecruitDate';
import { RecruitModule } from './recruit/recruit.module';
import { MemberLink } from './entites/MemberLink';
import { Resume } from './entites/Resume';
import { Cs } from './entites/Cs';
import { Education } from './entites/Education';
import { Inquiry } from './entites/Inquiry';
import { InquiryAnswer } from './entites/InquiryAnswer';
import { SeekDate } from './entites/SeekDate';
import { Seek } from './entites/Seek';
import { MemberModule } from './member/member.module';
import { AuthModule } from './auth/auth.module';
import { ConfigModule } from '@nestjs/config';
import { JwtAuthenticationMiddleware } from './common/middleweres/jwt-authentication.middlewere';

@Module({
  imports: [
    ConfigModule.forRoot({ envFilePath: '.env', isGlobal: true }),
    TypeOrmModule.forRoot({
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
        SeekDate
      ],
      charset: 'utf8mb4',
      synchronize: false,
      logging: true,
      keepConnectionAlive: true
    }),
    RecruitModule,
    MemberModule,
    AuthModule
  ],
  controllers: [AppController],
  providers: [AppService]
})
export class AppModule {
  configure(consumer: MiddlewareConsumer): any {
    consumer
      .apply(JwtAuthenticationMiddleware)
      .exclude({ path: 'member', method: RequestMethod.POST }, { path: 'auth/login', method: RequestMethod.POST }, { path: 'auth/refresh', method: RequestMethod.POST })
      .forRoutes('*');
  }
}
