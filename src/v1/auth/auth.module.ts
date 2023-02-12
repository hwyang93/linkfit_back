import { CacheModule, Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { LocalStrategy } from './local.strategy';
import { JwtModule } from '@nestjs/jwt';
import { JwtStrategy } from './jwt.strategy';
import { AuthService } from './auth.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Member } from '../../entites/Member';
import { AuthController } from './auth.controller';

@Module({
  imports: [
    CacheModule.register(),
    PassportModule,
    JwtModule.register({
      secretOrPrivateKey: 'MOVERLAB_ACCESS'
      // signOptions: { expiresIn: '10m' }
    }),
    TypeOrmModule.forFeature([Member])
  ],
  providers: [AuthService, LocalStrategy, JwtStrategy],
  exports: [AuthService],
  controllers: [AuthController]
})
export class AuthModule {}
