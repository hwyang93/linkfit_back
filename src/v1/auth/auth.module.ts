import { CacheModule, Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { LocalStrategy } from './local.strategy';
import { JwtModule } from '@nestjs/jwt';
import { JwtStrategy } from './jwt.strategy';
import { AuthService } from './auth.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Member } from '../../entites/Member';
import { AuthController } from './auth.controller';
// import { KakaoStrategy } from './kakao.strategy';
import { EmailAuth } from '../../entites/EmailAuth';
import { MailerModule } from '@nestjs-modules/mailer';
import { HandlebarsAdapter } from '@nestjs-modules/mailer/dist/adapters/handlebars.adapter';

@Module({
  imports: [
    CacheModule.register(),
    PassportModule,
    JwtModule.register({
      secretOrPrivateKey: process.env.JWT_PRIVATE_KEY
      // signOptions: { expiresIn: '10m' }
    }),
    TypeOrmModule.forFeature([Member, EmailAuth])
  ],
  providers: [AuthService, LocalStrategy, JwtStrategy],
  exports: [AuthService],
  controllers: [AuthController]
})
export class AuthModule {}
