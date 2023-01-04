import { ApiProperty } from '@nestjs/swagger';

export class SearchCommunityDto {
  @ApiProperty({ description: 'category', required: false })
  category: string[];

  @ApiProperty({ description: '본인이 작성한 게시글 여부', default: 'N', required: false })
  isWriter: string;
}
