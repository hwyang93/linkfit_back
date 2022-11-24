import {Controller, Get, Post, Body, Patch, Param, Delete, ParseIntPipe} from '@nestjs/common';
import { RecruitService } from './recruit.service';
import { CreateRecruitDto } from './dto/create-recruit.dto';
import { UpdateRecruitDto } from './dto/update-recruit.dto';
import {ApiOperation, ApiTags} from "@nestjs/swagger";
import {SearchRecruitDto} from "./dto/search-recruit.dto";

@ApiTags('recruit')
@Controller('recruit')
export class RecruitController {
  constructor(private readonly recruitService: RecruitService) {}

  @Post()
  createRecruit(@Body() createRecruitDto: CreateRecruitDto) {
    console.log(createRecruitDto);
    return this.recruitService.create(createRecruitDto);
  }

  @ApiOperation({ summary: '구인 공고 목록 조회' })
  @Get()
  async getRecruitList(@Param() searchParam:SearchRecruitDto) {
    return this.recruitService.getRecruitList(searchParam);
  }

  @ApiOperation({ summary: '구인 공고 상세 조회' })
  @Get(':seq')
  async getRecruit(@Param('seq', ParseIntPipe) seq: number) {
    return this.recruitService.getRecruit(seq);
  }

  @Patch(':seq')
  update(@Param('seq') id: string, @Body() updateRecruitDto: UpdateRecruitDto) {
    return this.recruitService.update(+id, updateRecruitDto);
  }

  @Delete(':seq')
  deleteRecruit(@Param('seq', ParseIntPipe) seq: number) {
    return this.recruitService.deleteRecruit(seq);
  }
}
