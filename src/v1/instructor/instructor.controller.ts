import { Controller, Get, Post, Body, Patch, Param, Delete, ParseIntPipe, Query } from '@nestjs/common';
import { InstructorService } from './instructor.service';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { MemberDecorator } from '../../common/decorators/member.decorator';
import { Member } from '../../entites/Member';
import { CreateInstructorSuggestDto } from './dto/create-instructor-suggest.dto';
import { SearchInstructorDto } from './dto/search-instructor.dto';

@ApiTags('instructor')
@Controller('instructor')
export class InstructorController {
  constructor(private readonly instructorService: InstructorService) {}

  @ApiBearerAuth()
  @ApiOperation({ summary: '강사 목록 조회' })
  @Get()
  getInstructorList(@Query() searchParam: SearchInstructorDto, @MemberDecorator() member: Member) {
    return this.instructorService.getInstructorList(searchParam, member);
  }

  @ApiBearerAuth()
  @ApiOperation({ summary: '추천 강사 목록 조회' })
  @Get('recommended')
  getRecruitRecommendedList(@MemberDecorator() member: Member) {
    return this.instructorService.getRecruitRecommendedList(member);
  }

  @ApiBearerAuth()
  @ApiOperation({ summary: '강사 제안 등록' })
  @Post('suggest')
  createInstructorSuggest(@Body() createInstructorSuggestDto: CreateInstructorSuggestDto, @MemberDecorator() member: Member) {
    return this.instructorService.createInstructorSuggest(createInstructorSuggestDto, member);
  }

  @ApiBearerAuth()
  @ApiOperation({ summary: '강사 팔로우 등록', deprecated: true })
  @Post('follow/:seq')
  createInstructorFollow(@Param('seq', ParseIntPipe) seq: number, @MemberDecorator() member: Member) {
    return this.instructorService.createInstructorFollow(seq, member);
  }

  @ApiBearerAuth()
  @ApiOperation({ summary: '강사 팔로우 삭제', deprecated: true })
  @Delete('follow/:seq')
  deleteInstructorFollow(@Param('seq', ParseIntPipe) seq: number, @MemberDecorator() member: Member) {
    return this.instructorService.deleteInstructorFollow(seq, member);
  }

  @ApiBearerAuth()
  @ApiOperation({ summary: '강사 정보 상세조회' })
  @Get(':seq')
  getInstructor(@Param('seq', ParseIntPipe) seq: number) {
    return this.instructorService.getInstructor(seq);
  }
}
