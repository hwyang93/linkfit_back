import { Body, Controller, Delete, Get, Param, ParseIntPipe, Patch, Post, Query } from '@nestjs/common';
import { CsService } from './cs.service';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { SearchCsDto } from './dto/search-cs.dto';
import { CreateInquiryDto } from './dto/create-inquiry.dto';
import { MemberDecorator } from '../../common/decorators/member.decorator';
import { Member } from '../../entites/Member';
import { UpdateInquiryDto } from './dto/update-inquiry.dto';

@ApiTags('cs')
@Controller('cs')
export class CsController {
  constructor(private readonly csService: CsService) {}

  @ApiOperation({ summary: '1:1문의 문의항목 조회' })
  @Post('inquiry/items')
  getInquiryItems() {
    return this.csService.getInquiryItems();
  }

  @ApiBearerAuth()
  @ApiOperation({ summary: '1:1문의 등록' })
  @Post('inquiry')
  createInquiry(@Body() createInquiryDto: CreateInquiryDto, @MemberDecorator() member: Member) {
    return this.csService.createInquiry(createInquiryDto, member);
  }

  @ApiBearerAuth()
  @ApiOperation({ summary: '1:1문의 목록 조회' })
  @Get('inquiry')
  getInquiryList(@MemberDecorator() member: Member) {
    return this.csService.getInquiryList(member);
  }

  @ApiBearerAuth()
  @ApiOperation({ summary: '1:1문의 상세조회' })
  @Get('inquiry/:seq')
  getInquiry(@Param('seq', ParseIntPipe) seq: number, @MemberDecorator() member: Member) {
    return this.csService.getInquiry(seq, member);
  }

  @ApiBearerAuth()
  @ApiOperation({ summary: '1:1문의 수정' })
  @Patch('inquiry/:seq')
  updateInquiry(@Param('seq', ParseIntPipe) seq: number, @Body() updateInquiryDto: UpdateInquiryDto, @MemberDecorator() member: Member) {
    return this.csService.updateInquiry(seq, updateInquiryDto, member);
  }

  @ApiBearerAuth()
  @ApiOperation({ summary: '1:1문의 삭제' })
  @Delete('inquiry/:seq')
  deleteInquiry(@Param('seq', ParseIntPipe) seq: number, @MemberDecorator() member: Member) {
    return this.csService.deleteInquiry(seq, member);
  }

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
