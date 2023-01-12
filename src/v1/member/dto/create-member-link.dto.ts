import { ApiProperty } from '@nestjs/swagger';
import { MemberLink } from '../../../entites/MemberLink';

export class CreateMemberLinkDto {
  @ApiProperty({ description: '위도' })
  type: string;

  @ApiProperty({ description: '위도' })
  url: string;

  toEntity() {
    const entity = new MemberLink();
    entity.type = this.type;
    entity.url = this.url;

    return entity;
  }
}
