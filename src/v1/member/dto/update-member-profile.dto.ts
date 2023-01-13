import { ApiProperty } from '@nestjs/swagger';
import { Member } from '../../../entites/Member';
import { UpdateMemberLinkDto } from './update-member-link.dto';

export class UpdateMemberProfileDto {
  @ApiProperty({ description: '닉네임' })
  nickname: string;

  @ApiProperty({ description: '소개글' })
  intro: string;

  @ApiProperty({ description: '대표 업종' })
  field: string;

  @ApiProperty({ description: '링크', type: () => Array(UpdateMemberLinkDto) })
  links: UpdateMemberLinkDto[];

  toEntity() {
    const entity = new Member();
    entity.nickname = this?.nickname;
    entity.intro = this.intro;

    return entity;
  }
}
