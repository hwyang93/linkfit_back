import { Controller, Get, Post, Body, Patch, Param, Delete, ParseIntPipe } from '@nestjs/common';
import { RecruitService } from './recruit.service';
import { CreateRecruitDto } from './dto/create-recruit.dto';
import { UpdateRecruitDto } from './dto/update-recruit.dto';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { SearchRecruitDto } from './dto/search-recruit.dto';
import { CreateRecruitApplyDto } from './dto/create-recruit-apply.dto';
import { UpdateRecruitApplyDto } from './dto/update-recruit-apply.dto';

@ApiTags('recruit')
@Controller('recruit')
export class RecruitController {
  constructor(private readonly recruitService: RecruitService) {}

  @ApiOperation({ summary: '구인 공고 등록' })
  @Post()
  createRecruit(@Body() createRecruitDto: CreateRecruitDto) {
    console.log(createRecruitDto);
    return this.recruitService.create(createRecruitDto);
  }

  @ApiOperation({ summary: '구인 공고 목록 조회' })
  @Get()
  async getRecruitList(@Param() searchParam: SearchRecruitDto) {
    return this.recruitService.getRecruitList(searchParam);
  }

  @ApiOperation({ summary: '구인 공고 상세 조회' })
  @Get(':seq')
  async getRecruit(@Param('seq', ParseIntPipe) seq: number) {
    return this.recruitService.getRecruit(seq);
  }

  @ApiOperation({ summary: '구인 공고 수정' })
  @Patch(':seq')
  update(@Param('seq') id: string, @Body() updateRecruitDto: UpdateRecruitDto) {
    return this.recruitService.update(+id, updateRecruitDto);
  }

  @ApiOperation({ summary: '구인 공고 삭제' })
  @Delete(':seq')
  deleteRecruit(@Param('seq', ParseIntPipe) seq: number) {
    return this.recruitService.deleteRecruit(seq);
  }

  @ApiOperation({ summary: '구인 공고 지원' })
  @Post('apply')
  recruitApply(@Body() createRecruitApplyDto: CreateRecruitApplyDto) {
    console.log(createRecruitApplyDto);
    return this.recruitService.recruitApply(createRecruitApplyDto);
  }

  @ApiOperation({ summary: '구인 공고 지원 취소' })
  @Delete('apply/:seq')
  deleteRecruitApply(@Param('seq', ParseIntPipe) seq: number) {
    return this.recruitService.deleteRecruitApply(seq);
  }

  @ApiOperation({ summary: '구인 공고 지원 목록 조회' })
  @Get(':seq/apply')
  getRecruitApplyList(@Param('seq', ParseIntPipe) seq: number) {
    return this.recruitService.getRecruitApplyList(seq);
  }

  @ApiOperation({ summary: '구인 공고 지원 상태 변경' })
  @Patch(':seq/apply')
  updateRecruitApply(@Param('seq', ParseIntPipe) seq: number, @Body() updateRecruitApplyDto: UpdateRecruitApplyDto) {
    return this.recruitService.updateRecruitApply(seq, updateRecruitApplyDto);
  }
}
