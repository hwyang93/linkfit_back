import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { LocalStrategy } from './local.strategy';
import { JwtModule } from '@nestjs/jwt';
import { JwtStrategy } from './Jwt.strategy';
import { AuthService } from './auth.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Member } from '../entites/Member';

@Module({
  imports: [
    PassportModule,
    JwtModule.register({
      secret: 'MOVERLAB',
      signOptions: {}
    }),
    TypeOrmModule.forFeature([Member])
  ],
  providers: [AuthService, LocalStrategy, JwtStrategy],
  exports: [AuthService]
})
export class AuthModule {}
