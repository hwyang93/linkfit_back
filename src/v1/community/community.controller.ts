import { Controller, Get, Post, Body, Patch, Param, Delete, Query, ParseIntPipe } from '@nestjs/common';
import { CommunityService } from './community.service';
import { CreateCommunityDto } from './dto/create-community.dto';
import { UpdateCommunityDto } from './dto/update-community.dto';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { MemberDecorator } from '../../common/decorators/member.decorator';
import { Member } from '../../entites/Member';
import { SearchRecruitDto } from '../recruit/dto/search-recruit.dto';
import { SearchCommunityDto } from './dto/search-community.dto';
import { CreateCommunityCommentDto } from './dto/create-community-comment.dto';

@ApiTags('community')
@Controller('community')
export class CommunityController {
  constructor(private readonly communityService: CommunityService) {}

  @ApiBearerAuth()
  @ApiOperation({ summary: '커뮤니티 게시글 등록' })
  @Post()
  createCommunity(@Body() createCommunityDto: CreateCommunityDto, @MemberDecorator() member: Member) {
    return this.communityService.createCommunity(createCommunityDto, member);
  }

  @ApiOperation({ summary: '커뮤니티 게시글 목록 조회' })
  @Get()
  getCommunityList(@Query() searchParam: SearchCommunityDto, @MemberDecorator() member: Member) {
    return this.communityService.getCommunityList(searchParam, member);
  }

  @ApiOperation({ summary: '커뮤니티 게시글 상세 조회' })
  @Get(':seq')
  getCommunity(@Param('seq', ParseIntPipe) seq: number) {
    return this.communityService.getCommunity(seq);
  }

  @ApiBearerAuth()
  @ApiOperation({ summary: '커뮤니티 게시글 댓글 등록' })
  @Post(':seq/comment')
  createCommunityComment(@Param('seq', ParseIntPipe) seq: number, @Body() createCommunityCommentDto: CreateCommunityCommentDto, @MemberDecorator() member: Member) {
    return this.communityService.createCommunityComment(seq, createCommunityCommentDto, member);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateCommunityDto: UpdateCommunityDto) {
    return this.communityService.update(+id, updateCommunityDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.communityService.remove(+id);
  }
}
