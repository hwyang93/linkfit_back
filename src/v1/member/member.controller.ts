import { Controller, Get, Post, Body, Patch, Param, Delete, ParseIntPipe, UseInterceptors, UploadedFile } from '@nestjs/common';
import { MemberService } from './member.service';
import { CreateMemberDto } from './dto/create-member.dto';
import { UpdateMemberDto } from './dto/update-member.dto';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { MemberDecorator } from '../../common/decorators/member.decorator';
import { Member } from '../../entites/Member';
import { CreateMemberLicenceDto } from './dto/create-member-licence.dto';
import { CreateRegionAuthDto } from './dto/create-region-auth.dto';
import { UpdateMemberProfileDto } from './dto/update-member-profile.dto';
import { UpdatePositionSuggestDto } from './dto/update-position-suggest.dto';
import { CreateMemberReputationDto } from './dto/create-member-reputation.dto';
import { UpdateMemberReputationDto } from './dto/update-member-reputation.dto';
import { FileInterceptor } from '@nestjs/platform-express';

@ApiTags('member')
@Controller('member')
export class MemberController {
  constructor(private readonly memberService: MemberService) {}

  @ApiOperation({ summary: '회원가입' })
  @Post()
  join(@Body() createMemberDto: CreateMemberDto) {
    return this.memberService.join(createMemberDto);
  }

  @ApiBearerAuth()
  @ApiOperation({ summary: '내 정보 조회' })
  @Get()
  getMemberInfo(@MemberDecorator() member: Member) {
    return this.memberService.getMemberInfo(member);
  }

  @ApiBearerAuth()
  @ApiOperation({ summary: 'my page 조회' })
  @Get('my')
  async getMemberMy(@MemberDecorator() member: Member) {
    const memberInfo = await this.memberService.getMemberInfo(member);
    if (memberInfo.type === 'COMPANY') {
      return this.memberService.getMemberMyCompany(member);
    } else {
      return this.memberService.getMemberMy(member);
    }
  }

  @ApiBearerAuth()
  @ApiOperation({ summary: '프로필 수정' })
  @UseInterceptors(FileInterceptor('file'))
  @Patch('profile')
  updateMemberProfile(@UploadedFile() file: Express.MulterS3.File, @Body() updateMemberProfileDto: UpdateMemberProfileDto, @MemberDecorator() member: Member) {
    return this.memberService.updateMemberProfile(updateMemberProfileDto, file, member);
  }

  @ApiBearerAuth()
  @ApiOperation({ summary: '자격증 등록' })
  @UseInterceptors(FileInterceptor('file'))
  @Post('licence')
  createMemberLicence(@UploadedFile() file: Express.MulterS3.File, @Body() createMemberLicenceDto: CreateMemberLicenceDto, @MemberDecorator() member: Member) {
    return this.memberService.createMemberLicence(createMemberLicenceDto, file, member);
  }

  @ApiBearerAuth()
  @ApiOperation({ summary: '내 자격증 목록 조회' })
  @Get('licence')
  getMemberLicenceList(@MemberDecorator() member: Member) {
    return this.memberService.getMemberLicenceList(member);
  }

  @ApiBearerAuth()
  @ApiOperation({ summary: '내 자격증 인증 취소' })
  @Patch('licence/:seq')
  updateMemberLicence(@Param('seq', ParseIntPipe) seq: number, @MemberDecorator() member: Member) {
    return this.memberService.updateMemberLicence(seq, member);
  }

  @ApiOperation({ summary: '이메일 확인' })
  @Get('check/email/:email')
  getMemberInfoByEmail(@Param('email') email: string) {
    return this.memberService.getMemberInfoByEmail(email);
  }

  @ApiOperation({ summary: '닉네임 중복확인' })
  @Get('check/nickname/:nickname')
  checkMemberNickname(@Param('nickname') nickname: string) {
    return this.memberService.checkMemberNickname(nickname);
  }

  @ApiBearerAuth()
  @ApiOperation({ summary: '제안 받은 포지션 목록 조회' })
  @Get('suggest/to')
  getSuggestToList(@MemberDecorator() member: Member) {
    return this.memberService.getSuggestToList(member);
  }

  @ApiBearerAuth()
  @ApiOperation({ summary: '제안한 포지션 목록 조회' })
  @Get('suggest/from')
  getSuggestFromList(@MemberDecorator() member: Member) {
    return this.memberService.getSuggestFromList(member);
  }

  @ApiBearerAuth()
  @ApiOperation({ summary: '포지션 제안 상세 조회' })
  @Get('suggest/:seq')
  getPositionSuggest(@Param('seq', ParseIntPipe) seq: number, @MemberDecorator() member: Member) {
    return this.memberService.getPositionSuggest(seq, member);
  }

  @ApiBearerAuth()
  @ApiOperation({ summary: '포지션 제안 상태 변경' })
  @Patch('suggest/:seq')
  updatePositionSuggestStatus(@Param('seq', ParseIntPipe) seq: number, @Body() updatePositionSuggestDto: UpdatePositionSuggestDto, @MemberDecorator() member: Member) {
    return this.memberService.updatePositionSuggestStatus(seq, updatePositionSuggestDto, member);
  }

  @ApiBearerAuth()
  @ApiOperation({ summary: '지역 인증 조회' })
  @Get('region')
  getRegionAuth(@MemberDecorator() member: Member) {
    return this.memberService.getRegionAuth(member);
  }

  @ApiBearerAuth()
  @ApiOperation({ summary: '지역 인증 등록' })
  @Post('region')
  createRegionAuth(@Body() createRegionAuthDto: CreateRegionAuthDto, @MemberDecorator() member: Member) {
    return this.memberService.createRegionAuth(createRegionAuthDto, member);
  }

  @ApiBearerAuth()
  @ApiOperation({ summary: '지역 인증 삭제' })
  @Delete('region/:seq')
  deleteRegionAuth(@Param('seq', ParseIntPipe) seq: number, @MemberDecorator() member: Member) {
    return this.memberService.deleteRegionAuth(seq, member);
  }

  @ApiBearerAuth()
  @ApiOperation({ summary: '작성한 후기 목록 조회' })
  @Get('reputation')
  getMemberReputation(@MemberDecorator() member: Member) {
    return this.memberService.getMemberReputation(member);
  }

  @ApiBearerAuth()
  @ApiOperation({ summary: '회원 후기 등록' })
  @Post('reputation')
  createMemberReputation(@Body() createMemberReputationDto: CreateMemberReputationDto, @MemberDecorator() member: Member) {
    return this.memberService.createMemberReputation(createMemberReputationDto, member);
  }

  @ApiBearerAuth()
  @ApiOperation({ summary: '회원 후기 수정' })
  @Patch('reputation/:seq')
  updateMemberReputation(@Param('seq', ParseIntPipe) seq: number, @Body() updateMemberReputationDto: UpdateMemberReputationDto, @MemberDecorator() member: Member) {
    return this.memberService.updateMemberReputation(seq, updateMemberReputationDto, member);
  }

  @ApiBearerAuth()
  @ApiOperation({ summary: '회원 후기 삭제' })
  @Delete('reputation/:seq')
  deleteMemberReputation(@Param('seq', ParseIntPipe) seq: number, @MemberDecorator() member: Member) {
    return this.memberService.deleteMemberReputation(seq, member);
  }

  @ApiBearerAuth()
  @ApiOperation({ summary: '팔로잉 목록 조회' })
  @Get('following/:type')
  getMemberFollowings(@Param('type') type: string, @MemberDecorator() member: Member) {
    if (type === 'INSTRUCTOR') {
      return this.memberService.getMemberFollowingsInstructor(type, member);
    } else if (type === 'COMPANY') {
      return this.memberService.getMemberFollowingsCompany(type, member);
    }
  }

  @ApiOperation({ summary: '회원이 작성한 공고 조회' })
  @Get(':seq/recruit')
  getRecruitByMember(@Param('seq', ParseIntPipe) seq: number) {
    return this.memberService.getRecruitByMember(seq);
  }

  @ApiOperation({ summary: '회원정보 조회' })
  @Get(':seq')
  findOne(@Param('seq', ParseIntPipe) seq: number) {
    return this.memberService.getMemberInfoBySeq(seq);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateMemberDto: UpdateMemberDto) {
    return this.memberService.update(+id, updateMemberDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.memberService.remove(+id);
  }
}
