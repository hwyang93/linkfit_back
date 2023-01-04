import { Injectable } from '@nestjs/common';
import { CreateCommunityDto } from './dto/create-community.dto';
import { UpdateCommunityDto } from './dto/update-community.dto';
import { Member } from '../../entites/Member';
import { InjectRepository } from '@nestjs/typeorm';
import { Community } from '../../entites/Community';
import { Repository } from 'typeorm';
import { SearchCommunityDto } from './dto/search-community.dto';
import { CreateCommunityCommentDto } from './dto/create-community-comment.dto';
import { CommunityComment } from '../../entites/CommunityComment';

@Injectable()
export class CommunityService {
  constructor(@InjectRepository(Community) private communityRepository: Repository<Community>, @InjectRepository(CommunityComment) private communityCommentRepository: Repository<CommunityComment>) {}

  async createCommunity(createCommunityDto: CreateCommunityDto, member: Member) {
    const community = createCommunityDto.toEntity();
    community.writerSeq = member.seq;
    const savedCommunity = await this.communityRepository.save(community);

    return { seq: savedCommunity.seq };
  }

  getCommunityList(searchParam: SearchCommunityDto, member: Member) {
    const communityList = this.communityRepository.createQueryBuilder('community').innerJoinAndSelect('community.writer', 'writer').where('1=1');
    if (searchParam.category) {
      communityList.andWhere('community.category IN (:...categorys)', { categorys: searchParam.category });
    }
    if (searchParam.isWriter === 'Y') {
      communityList.andWhere('community.writerSeq = :writerSeq', { writerSeq: member.seq });
    }
    communityList.orderBy('community.updateAt', 'DESC');
    return communityList.getMany();
  }

  async getCommunity(seq: number) {
    const community = await this.communityRepository
      .createQueryBuilder('community')
      .innerJoinAndSelect('community.writer', 'writer')
      .leftJoinAndSelect('community.comments', 'comments')
      .leftJoinAndSelect('comments.writer', 'commentWriter')
      .where({ seq })
      .getOne();
    console.log(community);
    await this.communityRepository
      .createQueryBuilder('community')
      .update()
      .set({ viewCount: community.viewCount + 1 })
      .where({ seq: community.seq })
      .execute();
    return community;
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

  remove(id: number) {
    return `This action removes a #${id} community`;
  }
}
