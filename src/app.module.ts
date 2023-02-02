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
import { RecruitModule } from './v1/recruit/recruit.module';
import { MemberLink } from './entites/MemberLink';
import { Resume } from './entites/Resume';
import { Cs } from './entites/Cs';
import { Education } from './entites/Education';
import { Inquiry } from './entites/Inquiry';
import { InquiryAnswer } from './entites/InquiryAnswer';
import { SeekDate } from './entites/SeekDate';
import { Seek } from './entites/Seek';
import { MemberModule } from './v1/member/member.module';
import { AuthModule } from './v1/auth/auth.module';
import { ConfigModule } from '@nestjs/config';
import { JwtAuthenticationMiddleware } from './common/middleweres/jwt-authentication.middlewere';
import { ResumeModule } from './v1/resume/resume.module';
import { LoggerMiddleware } from './common/middleweres/logger.middleware';
import { InstructorModule } from './v1/instructor/instructor.module';
import { CommunityModule } from './v1/community/community.module';
import { CsModule } from './v1/cs/cs.module';
import { CompanyModule } from './company/company.module';

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
      autoLoadEntities: true,
      synchronize: true,
      logging: true,
      keepConnectionAlive: true
    }),
    RecruitModule,
    MemberModule,
    AuthModule,
    ResumeModule,
    InstructorModule,
    CommunityModule,
    CsModule,
    CompanyModule
  ],
  controllers: [AppController],
  providers: [AppService]
})
export class AppModule {
  configure(consumer: MiddlewareConsumer): any {
    consumer.apply(LoggerMiddleware).forRoutes('*');
    consumer
      .apply(JwtAuthenticationMiddleware)
      .exclude({ path: 'member', method: RequestMethod.POST }, { path: 'auth/login', method: RequestMethod.POST }, { path: 'auth/refresh', method: RequestMethod.POST })
      .forRoutes('*');
  }
}
