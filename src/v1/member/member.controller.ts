import { Controller, Get, Post, Body, Patch, Param, Delete, ParseIntPipe } from '@nestjs/common';
import { MemberService } from './member.service';
import { CreateMemberDto } from './dto/create-member.dto';
import { UpdateMemberDto } from './dto/update-member.dto';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { MemberDecorator } from '../../common/decorators/member.decorator';
import { Member } from '../../entites/Member';
import { CreateMemberLicenceDto } from './dto/create-member-licence.dto';

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
  @ApiOperation({ summary: '자격증 등록' })
  @Post('licence')
  createMemberLicence(@Body() createMemberLicenceDto: CreateMemberLicenceDto, @MemberDecorator() member: Member) {
    return this.memberService.createMemberLicence(createMemberLicenceDto, member);
  }

  @ApiBearerAuth()
  @ApiOperation({ summary: '내 자격증 목록 조회' })
  @Get('licence')
  getMemberLicenceList(@MemberDecorator() member: Member) {
    return this.memberService.getMemberLicenceList(member);
  }

  @ApiBearerAuth()
  @ApiOperation({ summary: '내 자격증 삭제' })
  @Delete('licence/:seq')
  deleteMemberLicence(@Param('seq', ParseIntPipe) seq: number, @MemberDecorator() member: Member) {
    return this.memberService.deleteMemberLicence(seq, member);
  }

  @ApiOperation({ summary: '이메일 확인' })
  @Get('check/:email')
  getMemberInfoByEmail(@Param('email') email: string) {
    return this.memberService.getMemberInfoByEmail(email);
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
