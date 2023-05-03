import { Injectable, UnauthorizedException } from '@nestjs/common';
import { CreateCommunityDto } from './dto/create-community.dto';
import { UpdateCommunityDto } from './dto/update-community.dto';
import { Member } from '../../entites/Member';
import { InjectRepository } from '@nestjs/typeorm';
import { Community } from '../../entites/Community';
import { Repository } from 'typeorm';
import { SearchCommunityDto } from './dto/search-community.dto';
import { CreateCommunityCommentDto } from './dto/create-community-comment.dto';
import { CommunityComment } from '../../entites/CommunityComment';
import { CommunityFavorite } from '../../entites/CommunityFavorite';
import { sortBy } from 'lodash';

@Injectable()
export class CommunityService {
  constructor(
    @InjectRepository(Community) private communityRepository: Repository<Community>,
    @InjectRepository(CommunityComment) private communityCommentRepository: Repository<CommunityComment>,
    @InjectRepository(CommunityFavorite) private communityFavoriteRepository: Repository<CommunityFavorite>
  ) {}

  async createCommunity(createCommunityDto: CreateCommunityDto, member: Member) {
    const community = createCommunityDto.toEntity();
    community.writerSeq = member.seq;
    const savedCommunity = await this.communityRepository.save(community);

    return { seq: savedCommunity.seq };
  }

  async getCommunityList(searchParam: SearchCommunityDto, member: Member) {
    let communityList: any = this.communityRepository
      .createQueryBuilder('community')
      .innerJoinAndSelect('community.writer', 'writer')
      .leftJoinAndSelect('writer.company', 'company')
      .leftJoinAndSelect('community.comments', 'comments')
      .leftJoinAndSelect('comments.writer', 'commentWriter')
      .leftJoinAndSelect('commentWriter.company', 'commentCompany')
      // .leftJoinAndSelect('community.bookmarks', 'bookmarks')
      .addSelect(sq => {
        return sq.select('COUNT(*)', 'bookmarkCount').from(CommunityFavorite, 'bookmarks').where('bookmarks.favoriteSeq = community.seq');
      }, 'bookmarkCount')
      .addSelect(sq => {
        return sq
          .select('bookmarks.seq', 'isBookmark')
          .from(CommunityFavorite, 'bookmarks')
          .where('bookmarks.favoriteSeq = community.seq')
          .andWhere('bookmarks.memberSeq = :memberSeq', { memberSeq: member.seq });
      }, 'isBookmark')
      .where('1=1');
    if (searchParam.category) {
      communityList.andWhere('community.category IN (:categorys)', { categorys: searchParam.category });
    }
    communityList.orderBy('community.updatedAt', 'DESC');
    communityList = await communityList.getRawAndEntities();
    // const sample = await this.communityRepository
    //   .createQueryBuilder('community')
    //   .innerJoinAndSelect('community.writer', 'writer')
    //   .leftJoinAndSelect('writer.company', 'company')
    //   .leftJoinAndSelect('community.comments', 'comments')
    //   .leftJoinAndSelect('comments.writer', 'commentWriter')
    //   .leftJoinAndSelect('commentWriter.company', 'commentCompany')
    //     .leftJoinAndSelect('community.bookmarks', 'bookmarks')
    //   .addSelect(sq => {
    //     return sq
    //       .select('bookmarks.seq', 'isBookmark')
    //       .from(CommunityFavorite, 'bookmarks')
    //       .where('bookmarks.favoriteSeq = community.seq')
    //       .andWhere('bookmarks.memberSeq = :memberSeq', { memberSeq: member.seq });
    //   }, 'isBookmark')
    //   .where('1=1')
    //   .getRawAndEntities();

    // console.log('sample::::::::::');
    // console.log(await sample.getRawAndEntities());
    // const result = {
    //   ...sample.entities
    // };
    const result = [];
    communityList.entities.forEach(item => {
      result.push({
        ...item,
        bookmarkCount: parseInt(
          communityList.raw.find(raw => {
            return raw.community_SEQ === item.seq;
          }).bookmarkCount
        ),
        isBookmark: communityList.raw.find(raw => {
          return raw.community_SEQ === item.seq;
        }).isBookmark
          ? 'Y'
          : 'N'
      });
    });
    return result;
  }

  async getCommunityListMy(member: Member) {
    let result = [];
    const communityList = await this.communityRepository
      .createQueryBuilder('community')
      .innerJoinAndSelect('community.writer', 'writer')
      .leftJoinAndSelect('writer.company', 'company')
      .leftJoinAndSelect('community.comments', 'comments')
      .leftJoinAndSelect('comments.writer', 'commentWriter')
      .leftJoinAndSelect('commentWriter.company', 'commentCompany')
      .leftJoinAndSelect('community.bookmarks', 'bookmarks')
      .where('community.writerSeq = :writerSeq', { writerSeq: member.seq })
      .getMany();

    const communityCommentList = await this.communityCommentRepository.createQueryBuilder('communityComment').where('communityComment.writerSeq = :writerSeq', { writerSeq: member.seq }).getMany();

    result = [...communityList, ...communityCommentList];

    return sortBy(result, 'updatedAt').reverse();
  }

  async getCommunity(seq: number, member: Member) {
    const community = await this.communityRepository
      .createQueryBuilder('community')
      .innerJoinAndSelect('community.writer', 'writer')
      .leftJoinAndSelect('writer.company', 'company')
      .leftJoinAndSelect('writer.profileImage', 'profileImage')
      .leftJoinAndSelect('community.comments', 'comments')
      .leftJoinAndSelect('comments.writer', 'commentWriter')
      .leftJoinAndSelect('commentWriter.company', 'commentCompany')
      .leftJoinAndSelect('commentWriter.profileImage', 'commentProfileImage')
      // .leftJoinAndSelect('community.bookmarks', 'bookmarks')
      .addSelect(sq => {
        return sq.select('COUNT(*)', 'bookmarkCount').from(CommunityFavorite, 'bookmarks').where('bookmarks.favoriteSeq = community.seq');
      }, 'bookmarkCount')
      .addSelect(sq => {
        return sq
          .select('bookmarks.seq', 'isBookmark')
          .from(CommunityFavorite, 'bookmarks')
          .where('bookmarks.favoriteSeq = community.seq')
          .andWhere('bookmarks.memberSeq = :memberSeq', { memberSeq: member.seq });
      }, 'isBookmark')
      .where({ seq })
      .getRawAndEntities();

    await this.communityRepository
      .createQueryBuilder('community')
      .update()
      .set({ updatedAt: community.entities[0].updatedAt, viewCount: community.entities[0].viewCount + 1 })
      .where({ seq })
      .execute();

    let result = {};
    community.entities.forEach(item => {
      result = {
        ...item,
        bookmarkCount: parseInt(
          community.raw.find(raw => {
            return raw.community_SEQ === item.seq;
          }).bookmarkCount
        ),
        isBookmark: community.raw.find(raw => {
          return raw.community_SEQ === item.seq;
        }).isBookmark
          ? 'Y'
          : 'N'
      };
    });
    return result;
    // return community;
  }

  async createCommunityComment(seq: number, createCommunityCommentDto: CreateCommunityCommentDto, member: Member) {
    const communityComment = createCommunityCommentDto.toEntity();
    communityComment.communitySeq = seq;
    communityComment.writerSeq = member.seq;
    const savedCommunityComment = await this.communityCommentRepository.save(communityComment);

    return { seq: savedCommunityComment.seq };
  }

  update(id: number, updateCommunityDto: UpdateCommunityDto) {
    return `This action updates a #${id} community`;
  }

  async removeCommunity(seq: number, member: Member) {
    const community = await this.communityRepository.createQueryBuilder('community').where({ seq }).getOne();
    if (community.writerSeq !== member.seq) {
      throw new UnauthorizedException('허용되지 않은 접근입니다.');
    }
    await this.communityRepository.createQueryBuilder('community').softDelete().where({ seq }).execute();
    return { seq };
  }

  async createCommunityBookmark(seq: number, member: Member) {
    const communityFavorite = new CommunityFavorite();
    communityFavorite.memberSeq = member.seq;
    communityFavorite.favoriteSeq = seq;

    const checkRecruitBookmark = await this.communityFavoriteRepository
      .createQueryBuilder('communityFavorite')
      .where('communityFavorite.memberSeq = :memberSeq', { memberSeq: member.seq })
      .andWhere('communityFavorite.favoriteSeq = :favoriteSeq', { favoriteSeq: seq })
      .withDeleted()
      .getOne();

    let savedSeq;

    if (!checkRecruitBookmark) {
      const { seq } = await this.communityFavoriteRepository.save(communityFavorite);
      savedSeq = seq;
    } else {
      await this.communityFavoriteRepository
        .createQueryBuilder('communityFavorite')
        .restore()
        .where('memberSeq = :memberSeq', { memberSeq: member.seq })
        .andWhere('favoriteSeq = :favoriteSeq', { favoriteSeq: seq })
        .execute();

      savedSeq = checkRecruitBookmark.seq;
    }
    return { seq: savedSeq };
  }

  async deleteCommunityBookmark(seq: number, member: Member) {
    const recruitBookmark = await this.communityFavoriteRepository.createQueryBuilder('communityFavorite').where('communityFavorite.favoriteSeq = :seq', { seq }).getOne();
    if (recruitBookmark.memberSeq !== member.seq) {
      throw new UnauthorizedException('허용되지 않은 접근입니다.');
    }
    await this.communityFavoriteRepository
      .createQueryBuilder('communityFavorite')
      .softDelete()
      .where('favoriteSeq = :seq', { seq })
      .andWhere('memberSeq = :memberSeq', { memberSeq: member.seq })
      .execute();
    return { seq };
  }

  async removeCommunityComment(seq: number, member: Member) {
    const comment = await this.communityCommentRepository.createQueryBuilder('comment').where({ seq }).getOne();
    if (comment.writerSeq !== member.seq) {
      throw new UnauthorizedException('허용되지 않은 접근입니다.');
    }
    await this.communityCommentRepository.createQueryBuilder('comment').softDelete().where({ seq }).execute();
    return { seq };
  }

  async getCommunityBookmarks(member: Member) {
    const favoriteList = await this.communityFavoriteRepository
      .createQueryBuilder('communityFavorite')
      .leftJoinAndSelect('communityFavorite.community', 'community')
      .leftJoinAndSelect('community.writer', 'writer')
      .leftJoinAndSelect('writer.company', 'company')
      .leftJoinAndSelect('community.bookmarks', 'bookmarks')
      .leftJoinAndSelect('community.comments', 'comments')
      .where('communityFavorite.memberSeq = :memberSeq', { memberSeq: member.seq })
      .getMany();

    const result = [];

    favoriteList.forEach(item => {
      item.community['isBookmark'] = 'Y';
      result.push({ ...item });
    });

    return result;
  }
}
