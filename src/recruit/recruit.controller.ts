import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { RecruitService } from './recruit.service';
import { CreateRecruitDto } from './dto/create-recruit.dto';
import { UpdateRecruitDto } from './dto/update-recruit.dto';
import {ApiOperation, ApiTags} from "@nestjs/swagger";

@ApiTags('recruit')
@Controller('recruit')
export class RecruitController {
  constructor(private readonly recruitService: RecruitService) {}

  @Post()
  create(@Body() createRecruitDto: CreateRecruitDto) {
    return this.recruitService.create(createRecruitDto);
  }

  @ApiOperation({ summary: '구인 공고 목록 조회' })
  @Get()
  async getRecruitList() {
    return this.recruitService.getRecruitList();
  }

  @ApiOperation({ summary: '구인 공고 상세 조회' })
  @Get(':id')
  async getRecruit(@Param('id') id: string) {
    return this.recruitService.getRecruit(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateRecruitDto: UpdateRecruitDto) {
    return this.recruitService.update(+id, updateRecruitDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.recruitService.remove(+id);
  }
}
