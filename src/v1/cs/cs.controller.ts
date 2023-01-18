import { Controller, Get, Param, ParseIntPipe } from '@nestjs/common';
import { CsService } from './cs.service';
import { ApiOperation, ApiQuery, ApiTags } from '@nestjs/swagger';

@ApiTags('cs')
@Controller('cs')
export class CsController {
  constructor(private readonly csService: CsService) {}

  @ApiOperation({ summary: '고객센터 게시글 목록 조회' })
  @ApiQuery({ name: 'type', enum: ['notice', 'faq'] })
  @Get(':type')
  getCsList(@Param('type') type: string) {
    return this.csService.getCsList(type);
  }

  @ApiOperation({ summary: '고객센터 게시글 상세 조회' })
  @Get(':seq')
  getCs(@Param('seq', ParseIntPipe) seq: number) {
    return this.csService.getCs(seq);
  }
}
