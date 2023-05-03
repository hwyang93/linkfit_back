import { Controller, Get, Post, Body, Patch, Param, Delete, Query, ParseIntPipe } from '@nestjs/common';
import { CommunityService } from './community.service';
import { CreateCommunityDto } from './dto/create-community.dto';
import { UpdateCommunityDto } from './dto/update-community.dto';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { MemberDecorator } from '../../common/decorators/member.decorator';
import { Member } from '../../entites/Member';
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

  @ApiBearerAuth()
  @ApiOperation({ summary: '커뮤니티 게시글 목록 조회' })
  @Get()
  getCommunityList(@Query() searchParam: SearchCommunityDto, @MemberDecorator() member: Member) {
    if (searchParam.isWriter === 'Y') {
      return this.communityService.getCommunityListMy(member);
    } else {
      return this.communityService.getCommunityList(searchParam, member);
    }
  }

  @ApiBearerAuth()
  @ApiOperation({ summary: '커뮤니티 게시글 댓글 삭제' })
  @Delete('comment/:seq')
  removeCommunityComment(@Param('seq', ParseIntPipe) seq: number, @MemberDecorator() member: Member) {
    return this.communityService.removeCommunityComment(seq, member);
  }

  @ApiBearerAuth()
  @ApiOperation({ summary: '커뮤니티 게시글 북마크 조회' })
  @Get('bookmark')
  getCommunityBookmarks(@MemberDecorator() member: Member) {
    return this.communityService.getCommunityBookmarks(member);
  }

  @ApiBearerAuth()
  @ApiOperation({ summary: '커뮤니티 게시글 북마크 등록' })
  @Post(':seq/bookmark')
  createCommunityBookmark(@Param('seq', ParseIntPipe) seq: number, @MemberDecorator() member: Member) {
    return this.communityService.createCommunityBookmark(seq, member);
  }

  @ApiBearerAuth()
  @ApiOperation({ summary: '커뮤니티 게시글 북마크 삭제' })
  @Delete(':seq/bookmark')
  deleteCommunityBookmark(@Param('seq', ParseIntPipe) seq: number, @MemberDecorator() member: Member) {
    return this.communityService.deleteCommunityBookmark(seq, member);
  }

  @ApiBearerAuth()
  @ApiOperation({ summary: '커뮤니티 게시글 댓글 등록' })
  @Post(':seq/comment')
  createCommunityComment(@Param('seq', ParseIntPipe) seq: number, @Body() createCommunityCommentDto: CreateCommunityCommentDto, @MemberDecorator() member: Member) {
    return this.communityService.createCommunityComment(seq, createCommunityCommentDto, member);
  }

  @ApiOperation({ summary: '커뮤니티 게시글 상세 조회' })
  @Get(':seq')
  getCommunity(@Param('seq', ParseIntPipe) seq: number, @MemberDecorator() member: Member) {
    return this.communityService.getCommunity(seq, member);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateCommunityDto: UpdateCommunityDto) {
    return this.communityService.update(+id, updateCommunityDto);
  }

  @ApiBearerAuth()
  @ApiOperation({ summary: '커뮤니티 게시글 삭제' })
  @Delete(':seq')
  removeCommunity(@Param('seq', ParseIntPipe) seq: number, @MemberDecorator() member: Member) {
    return this.communityService.removeCommunity(seq, member);
  }
}
