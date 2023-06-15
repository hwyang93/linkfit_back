import { Body, CACHE_MANAGER, Controller, Get, Inject, Post, Req, Res, UnauthorizedException, UseGuards } from '@nestjs/common';
import { Cache } from 'cache-manager';
import { ApiBearerAuth, ApiBody, ApiOperation, ApiTags } from '@nestjs/swagger';
import { LocalAuthGuard } from './local-auth.guard';
import { AuthService } from './auth.service';
import { JwtAuthGuard } from './jwt-auth.guard';
import { MemberDecorator } from '../../common/decorators/member.decorator';
import { Member } from '../../entites/Member';
import { AuthGuard } from '@nestjs/passport';
import { CreateSendEmailDto } from './dto/create-send-email.dto';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @ApiOperation({ summary: '로그인' })
  @ApiBody({
    schema: {
      properties: {
        email: { type: 'string', default: 'test@test.com' },
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
  @Post('refresh')
  async refresh(@Req() req, @MemberDecorator() member: Member) {
    let token;
    if (req.headers.authorization && req.headers.authorization.split(' ')[0] === 'Bearer') {
      token = req.headers.authorization.split(' ')[1];
    } else {
      throw new UnauthorizedException('토큰이 없습니다.');
    }

    return this.authService.refresh(token, member);
  }

  // @Get('login/kakao')
  // @UseGuards(AuthGuard('kakao'))
  // async loginKakao(@Req() req, @Res() res) {
  //   console.log('kakao');
  //   await this.authService.login({ req, res });
  // }

  // @ApiOperation({
  //   summary: '카카오 로그인 콜백',
  //   description: '카카오 로그인시 콜백 라우터입니다.'
  // })
  // @UseGuards(KakaoAuthGuard)
  // @Get('auth/kakao/callback')
  // async kakaocallback(@Req() req, @Res() res, @MemberDecorator() member: Member) {
  //   console.log('callback');
  //   console.log(member);
  //   // if (req.user.type === 'login') {
  //   //   res.cookie('access_token', req.user.access_token);
  //   //   res.cookie('refresh_token', req.user.refresh_token);
  //   // } else {
  //   //   res.cookie('once_token', req.user.once_token);
  //   // }
  //   res.redirect('http://localhost:3000/user/profile');
  //   // res.end();
  //   // return member.email;
  //   return res.end();
  // }

  @ApiOperation({ summary: '이메일 인증번호 발송' })
  @Post('email')
  async createSendEmailAuth(@Body() createSendEmailDto: CreateSendEmailDto) {
    return this.authService.createSendEmailAuth(createSendEmailDto);
  }
}
