import { ApiProperty } from '@nestjs/swagger';
import { Community } from '../../../entites/Community';

export class CreateCommunityDto {
  @ApiProperty({ description: '카테고리' })
  category: string;
  @ApiProperty({ description: '제목' })
  title: string;
  @ApiProperty({ description: '내용' })
  contents: string;

  toEntity() {
    const entity = new Community();
    entity.category = this.category;
    entity.title = this.title;
    entity.contents = this.contents;

    return entity;
  }
}
