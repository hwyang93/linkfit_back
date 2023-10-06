import { PartialType } from '@nestjs/mapped-types';
import { CreateCommunityDto } from './create-community.dto';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateCommunityDto extends PartialType(CreateCommunityDto) {
  @ApiProperty({ description: '카테고리' })
  category: string;
  @ApiProperty({ description: '제목' })
  title: string;
  @ApiProperty({ description: '내용' })
  contents: string;
}
