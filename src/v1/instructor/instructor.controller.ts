import { Controller, Get, Post, Body, Patch, Param, Delete, ParseIntPipe } from '@nestjs/common';
import { InstructorService } from './instructor.service';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { MemberDecorator } from '../../common/decorators/member.decorator';
import { Member } from '../../entites/Member';
import { CreateInstructorSuggestDto } from './dto/create-instructor-suggest.dto';
import { UpdateInstructorSuggestDto } from './dto/update-instructor-suggest.dto';

@ApiTags('instructor')
@Controller('instructor')
export class InstructorController {
  constructor(private readonly instructorService: InstructorService) {}

  @ApiBearerAuth()
  @ApiOperation({ summary: '강사 목록 조회' })
  @Get()
  getInstructorList(@MemberDecorator() member: Member) {
    return this.instructorService.getInstructorList(member);
  }

  @ApiBearerAuth()
  @ApiOperation({ summary: '강사 제안 등록' })
  @Post('suggest')
  createInstructorSuggest(@Body() createInstructorSuggestDto: CreateInstructorSuggestDto, @MemberDecorator() member: Member) {
    return this.instructorService.createInstructorSuggest(createInstructorSuggestDto, member);
  }

  @ApiBearerAuth()
  @ApiOperation({ summary: '강사 제안 상태 변경' })
  @Patch('suggest/:seq')
  updateInstructorSuggestStatus(@Param('seq', ParseIntPipe) seq: number, @Body() updateInstructorSuggestDto: UpdateInstructorSuggestDto, @MemberDecorator() member: Member) {
    return this.instructorService.updateInstructorSuggestStatus(seq, updateInstructorSuggestDto, member);
  }

  @ApiBearerAuth()
  @ApiOperation({ summary: '강사 정보 상세조회' })
  @Get(':seq')
  getInstructor(@Param('seq', ParseIntPipe) seq: number) {
    return this.instructorService.getInstructor(seq);
  }
}
