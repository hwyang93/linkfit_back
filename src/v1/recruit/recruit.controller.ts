import { Controller, Get, Post, Body, Patch, Param, Delete, ParseIntPipe, UseGuards, Query } from '@nestjs/common';
import { RecruitService } from './recruit.service';
import { CreateRecruitDto } from './dto/create-recruit.dto';
import { UpdateRecruitDto } from './dto/update-recruit.dto';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { SearchRecruitDto } from './dto/search-recruit.dto';
import { CreateRecruitApplyDto } from './dto/create-recruit-apply.dto';
import { UpdateRecruitApplyDto } from './dto/update-recruit-apply.dto';
import { MemberDecorator } from '../../common/decorators/member.decorator';
import { Member } from '../../entites/Member';
import { LoggedInGuard } from '../../common/guards/logged-in.guard';

@ApiTags('recruit')
@Controller('recruit')
export class RecruitController {
  constructor(private readonly recruitService: RecruitService) {}

  @ApiBearerAuth()
  @ApiOperation({ summary: '구인 공고 등록' })
  @Post()
  async createRecruit(@Body() createRecruitDto: CreateRecruitDto, @MemberDecorator() member: Member) {
    return await this.recruitService.createRecruit(createRecruitDto, member);
  }

  @ApiBearerAuth()
  @ApiOperation({ summary: '구인 공고 목록 조회' })
  @Get()
  async getRecruitList(@Query() searchParam: SearchRecruitDto, @MemberDecorator() member: Member) {
    return this.recruitService.getRecruitList(searchParam, member);
  }

  @ApiBearerAuth()
  // @UseGuards(LoggedInGuard)
  @ApiOperation({ summary: '구인 공고 지원' })
  @Post('apply')
  createRecruitApply(@Body() createRecruitApplyDto: CreateRecruitApplyDto, @MemberDecorator() member: Member) {
    return this.recruitService.createRecruitApply(createRecruitApplyDto, member);
  }

  @ApiBearerAuth()
  @ApiOperation({ summary: '내 구인 공고 지원목록 조회' })
  @Get('apply')
  getRecruitApplyListByMember(@MemberDecorator() member: Member) {
    return this.recruitService.getRecruitApplyListByMember(member);
  }

  @ApiBearerAuth()
  @ApiOperation({ summary: '구인 공고 지원 상세 조회' })
  @Get('apply/:seq')
  getRecruitApply(@Param('seq', ParseIntPipe) seq: number, @MemberDecorator() member: Member) {
    return this.recruitService.getRecruitApply(seq, member);
  }

  @ApiBearerAuth()
  @ApiOperation({ summary: '구인 공고 지원 취소' })
  @Delete('apply/:seq')
  deleteRecruitApply(@Param('seq', ParseIntPipe) seq: number, @MemberDecorator() member: Member) {
    return this.recruitService.deleteRecruitApply(seq, member);
  }

  @ApiBearerAuth()
  // @UseGuards(LoggedInGuard)
  @ApiOperation({ summary: '구인 공고 북마크 목록 조회' })
  @Get('bookmark')
  getRecruitBookmarkList(@MemberDecorator() member: Member) {
    return this.recruitService.getRecruitBookmarkList(member);
  }

  @ApiBearerAuth()
  // @UseGuards(LoggedInGuard)
  @ApiOperation({ summary: '구인 공고 북마크 등록' })
  @Post('bookmark/:seq')
  createRecruitBookmark(@Param('seq', ParseIntPipe) seq: number, @MemberDecorator() member: Member) {
    return this.recruitService.createRecruitBookmark(seq, member);
  }

  @ApiBearerAuth()
  // @UseGuards(LoggedInGuard)
  @ApiOperation({ summary: '구인 공고 북마크 삭제' })
  @Delete('bookmark/:seq')
  deleteRecruitBookmark(@Param('seq', ParseIntPipe) seq: number, @MemberDecorator() member: Member) {
    return this.recruitService.deleteRecruitBookmark(seq, member);
  }

  @ApiOperation({ summary: '구인 공고 상세 조회' })
  @Get(':seq')
  async getRecruit(@Param('seq', ParseIntPipe) seq: number) {
    return this.recruitService.getRecruit(seq);
  }

  @ApiBearerAuth()
  @ApiOperation({ summary: '구인 공고 수정' })
  @Patch(':seq')
  update(@Param('seq') id: string, @Body() updateRecruitDto: UpdateRecruitDto, @MemberDecorator() member: Member) {
    return this.recruitService.update(+id, updateRecruitDto, member);
  }

  @ApiBearerAuth()
  @ApiOperation({ summary: '구인 공고 삭제' })
  @Delete(':seq')
  deleteRecruit(@Param('seq', ParseIntPipe) seq: number, @MemberDecorator() member: Member) {
    return this.recruitService.deleteRecruit(seq, member);
  }

  @ApiBearerAuth()
  @ApiOperation({ summary: '구인 공고 지원 목록 조회' })
  @Get(':seq/apply')
  getRecruitApplyListBySeq(@Param('seq', ParseIntPipe) seq: number, @MemberDecorator() member: Member) {
    return this.recruitService.getRecruitApplyListBySeq(seq, member);
  }

  @ApiOperation({ summary: '구인 공고 지원 상태 변경' })
  @Patch(':seq/apply')
  updateRecruitApply(@Param('seq', ParseIntPipe) seq: number, @Body() updateRecruitApplyDto: UpdateRecruitApplyDto, @MemberDecorator() member: Member) {
    return this.recruitService.updateRecruitApply(seq, updateRecruitApplyDto, member);
  }
}
