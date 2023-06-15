import { CACHE_MANAGER, ConflictException, HttpException, Inject, Injectable, InternalServerErrorException, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { Repository } from 'typeorm';
import { Member } from '../../entites/Member';
import { JwtService } from '@nestjs/jwt';
import { Cache } from 'cache-manager';
import { CreateSendEmailDto } from './dto/create-send-email.dto';
import { MailerService } from '@nestjs-modules/mailer';

const bcrypt = require('bcrypt');

@Injectable()
export class AuthService {
  constructor(
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
    @InjectRepository(Member) private memberRepository: Repository<Member>,
    private jwtService: JwtService,
    private readonly mailerService: MailerService
  ) {}

  async validateUser(email: string, password: string) {
    const member = await this.memberRepository.createQueryBuilder('member').select().addSelect('member.password').where({ email }).getOne();

    if (!member) {
      return null;
    }
    const result = await bcrypt.compare(password, member.password);

    if (result) {
      const { ...userWithoutPassword } = member;
      await this.memberRepository.createQueryBuilder('member').update().set({ lastLogin: new Date() }).where({ seq: member.seq }).execute();

      return userWithoutPassword;
    }
    return null;
  }

  async login(member: any) {
    const payload = { email: member.email, seq: member.seq };
    const accessToken = this.jwtService.sign(payload, { secret: process.env.JWT_PRIVATE_KEY });

    const refreshToken = this.jwtService.sign(payload, { expiresIn: '30d', secret: process.env.JWT_PUBLIC_KEY });
    await this.cacheManager.set(member.email, refreshToken, 0);

    return { accessToken, refreshToken };
  }

  async refresh(token: string, member: Member) {
    const cachedRefreshToken = (await this.cacheManager.get(member.email))?.toString();

    let decodedToken;
    try {
      decodedToken = this.jwtService.verify(cachedRefreshToken, { secret: process.env.JWT_PUBLIC_KEY });
    } catch (e) {
      throw new UnauthorizedException('만료된 리프레시 토큰입니다.');
    }
    const memberInfo = await this.memberRepository.findOne({
      where: { seq: decodedToken.seq },
      select: ['seq', 'email']
    });
    const payload = { seq: memberInfo.seq, email: member.email };
    return {
      accessToken: this.jwtService.sign(payload, { expiresIn: '1m', secret: process.env.JWT_PRIVATE_KEY })
    };
  }

  async OAuthLogin({ req, res }) {
    console.log('req::::::');
    console.log(req);
    console.log('res::::::');
    console.log(res);
  }

  async createSendEmailAuth(createSendEmailDto: CreateSendEmailDto) {
    await this.sendMail(createSendEmailDto.email);
  }

  async sendMail(email: string) {
    const authNumber = this.makeAuthNumber();
    await this.mailerService
      .sendMail({
        to: email,
        subject: '[링크핏] 비밀번호 찾기 인증번호',
        template: './sendEmailAuth.ejs',
        context: { authNumber: authNumber }
      })
      .then(result => {
        console.log(result);
      })
      .catch(error => {
        console.log(error);
        throw new InternalServerErrorException('서버에서 에러가 발생했습니다.');
      });
  }

  makeAuthNumber() {
    let authNumber = '';
    for (let i = 0; i < 6; i++) {
      const num = Math.floor(Math.random() * 10);
      authNumber += num;
    }
    return authNumber;
  }
}
