import { CACHE_MANAGER, Controller, Get, Inject, Post, Req, UnauthorizedException, UseGuards } from '@nestjs/common';
import { Cache } from 'cache-manager';
import { ApiBearerAuth, ApiBody, ApiOperation, ApiTags } from '@nestjs/swagger';
import { LocalAuthGuard } from './local-auth.guard';
import { AuthService } from './auth.service';
import { JwtAuthGuard } from './jwt-auth.guard';
import { MemberDecorator } from '../../common/decorators/member.decorator';
import { Member } from '../../entites/Member';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @ApiOperation({ summary: '로그인' })
  @ApiBody({
    schema: {
      properties: {
        email: { type: 'string' },
        password: { type: 'string' }
      }
    }
  })
  @UseGuards(LocalAuthGuard)
  @Post('login')
  async login(@Req() req) {
    return this.authService.login(req.user);
  }

  @ApiOperation({ summary: '토큰 재발급' })
  @ApiBearerAuth()
  @Post('/refresh')
  async refresh(@Req() req) {
    let token;
    if (req.headers.authorization && req.headers.authorization.split(' ')[0] === 'Bearer') {
      token = req.headers.authorization.split(' ')[1];
    } else {
      throw new UnauthorizedException('인증이 필요합니다.');
    }

    return this.authService.refresh(token);
  }
}
