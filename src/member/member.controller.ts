import { Controller, Get, Post, Body, Patch, Param, Delete, ParseIntPipe } from '@nestjs/common';
import { MemberService } from './member.service';
import { CreateMemberDto } from './dto/create-member.dto';
import { UpdateMemberDto } from './dto/update-member.dto';
import { ApiOperation, ApiTags } from '@nestjs/swagger';

@ApiTags('member')
@Controller('member')
export class MemberController {
  constructor(private readonly memberService: MemberService) {}

  @ApiOperation({ summary: '회원가입' })
  @Post()
  join(@Body() createMemberDto: CreateMemberDto) {
    return this.memberService.join(createMemberDto);
  }

  @ApiOperation({ summary: '이메일 확인' })
  @Get('check/:email')
  getMemberInfoByEmail(@Param('email') email: string) {
    return this.memberService.getMemberInfoByEmail(email);
  }

  @Get(':seq')
  findOne(@Param('seq', ParseIntPipe) seq: number) {
    return this.memberService.findOne(seq);
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
