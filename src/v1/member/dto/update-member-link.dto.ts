import { ApiProperty } from '@nestjs/swagger';
import { MemberLink } from '../../../entites/MemberLink';

export class UpdateMemberLinkDto {
  @ApiProperty({ description: '고유번호' })
  seq: number;

  @ApiProperty({ description: '링크 타입' })
  type: string;

  @ApiProperty({ description: '링크 URL' })
  url: string;

  toEntity() {
    const entity = new MemberLink();
    entity.type = this.type;
    entity.url = this.url;

    return entity;
  }
}
