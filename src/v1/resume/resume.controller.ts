import { Controller, Get, Post, Body, Patch, Param, Delete, ParseIntPipe } from '@nestjs/common';
import { ResumeService } from './resume.service';
import { CreateResumeDto } from './dto/create-resume.dto';
import { UpdateResumeDto } from './dto/update-resume.dto';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { MemberDecorator } from '../../common/decorators/member.decorator';
import { Member } from '../../entites/Member';
import { UpdateResumeMasterDto } from './dto/update-resume-master.dto';

@ApiTags('resume')
@Controller('resume')
export class ResumeController {
  constructor(private readonly resumeService: ResumeService) {}

  @ApiBearerAuth()
  @ApiOperation({ summary: '이력서 등록' })
  @Post()
  create(@Body() createResumeDto: CreateResumeDto, @MemberDecorator() member: Member) {
    return this.resumeService.create(createResumeDto, member);
  }

  @ApiBearerAuth()
  @ApiOperation({ summary: '내 이력서 목록 불러오기' })
  @Get()
  findAll(@MemberDecorator() member: Member) {
    return this.resumeService.getResumeList(member);
  }

  @ApiOperation({ summary: '이력서 상세보기' })
  @Get(':seq')
  getResume(@Param('seq', ParseIntPipe) seq: number) {
    return this.resumeService.getResume(seq);
  }

  @ApiBearerAuth()
  @ApiOperation({ summary: '대표이력서 설정' })
  @Patch('master/:seq')
  setMasterResume(@Param('seq', ParseIntPipe) seq: number, @MemberDecorator() member: Member) {
    return this.resumeService.setMasterResume(seq, member);
  }

  @ApiBearerAuth()
  @ApiOperation({ summary: '이력서 공개여부 설정' })
  @Patch('open/:seq')
  setOpenResume(@Param('seq', ParseIntPipe) seq: number, @Body() updateResumeMasterDto: UpdateResumeMasterDto, @MemberDecorator() member: Member) {
    return this.resumeService.setOpenResume(seq, updateResumeMasterDto, member);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateResumeDto: UpdateResumeDto) {
    return this.resumeService.update(+id, updateResumeDto);
  }
  @ApiBearerAuth()
  @ApiOperation({ summary: '이력서 삭제' })
  @Delete(':seq')
  deleteResume(@Param('seq', ParseIntPipe) seq: number, @MemberDecorator() member: Member) {
    return this.resumeService.deleteResume(seq, member);
  }
}
