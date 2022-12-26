import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { InstructorService } from './instructor.service';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { MemberDecorator } from '../../common/decorators/member.decorator';
import { Member } from '../../entites/Member';

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
}
