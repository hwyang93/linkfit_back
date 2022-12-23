import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { InstructorService } from './instructor.service';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('instructor')
@Controller('instructor')
export class InstructorController {
  constructor(private readonly instructorService: InstructorService) {}

  @Get()
  getInstructorList() {
    return this.instructorService.getInstructorList();
  }
}
