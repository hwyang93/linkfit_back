import { ApiProperty } from '@nestjs/swagger';
import { CommunityComment } from '../../../entites/CommunityComment';

export class CreateCommunityCommentDto {
  @ApiProperty({ description: '내용' })
  contents: string;

  toEntity() {
    const entity = new CommunityComment();
    entity.contents = this.contents;

    return entity;
  }
}
