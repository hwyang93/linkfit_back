import { ApiProperty } from '@nestjs/swagger';
import { Member } from '../../../entites/Member';
import { MemberLink } from '../../../entites/MemberLink';
import { CreateMemberLinkDto } from './create-member-link.dto';

export class UpdateMemberProfileDto {
  @ApiProperty({ description: '닉네임' })
  nickname: string;

  @ApiProperty({ description: '소개글' })
  intro: string;

  @ApiProperty({ description: '링크', type: () => Array(CreateMemberLinkDto) })
  links: CreateMemberLinkDto[];

  toEntity() {
    const entity = new Member();
    entity.nickname = this?.nickname;
    entity.intro = this.intro;

    return entity;
  }
}
