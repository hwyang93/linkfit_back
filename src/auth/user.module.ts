import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { TypeOrmModule } from '@nestjs/typeorm';

import { AuthService } from './auth.service';
import { LocalSerializer } from './local.serializer';
import { LocalStrategy } from './local.strategy';
import { Member } from '../entites/Member';

@Module({
  imports: [PassportModule.register({ session: true }), TypeOrmModule.forFeature([Member])],
  providers: [AuthService, LocalStrategy, LocalSerializer]
})
export class AuthModule {}
