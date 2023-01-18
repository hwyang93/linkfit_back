import { Controller, Get, Param, ParseIntPipe, Query } from '@nestjs/common';
import { CsService } from './cs.service';
import { ApiOperation, ApiQuery, ApiTags } from '@nestjs/swagger';
import { SearchRecruitDto } from '../recruit/dto/search-recruit.dto';
import { SearchCsDto } from './dto/search-cs.dto';

@ApiTags('cs')
@Controller('cs')
export class CsController {
  constructor(private readonly csService: CsService) {}

  @ApiOperation({ summary: '고객센터 게시글 목록 조회' })
  @Get()
  getCsList(@Query() searchParam: SearchCsDto) {
    return this.csService.getCsList(searchParam);
  }

  @ApiOperation({ summary: '고객센터 게시글 상세 조회' })
  @Get(':seq')
  getCs(@Param('seq', ParseIntPipe) seq: number) {
    return this.csService.getCs(seq);
  }
}
