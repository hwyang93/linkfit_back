import { ApiProperty } from '@nestjs/swagger';

export class PaginationDto {
  @ApiProperty({ description: '현재 페이지', required: false })
  curPage: number;

  @ApiProperty({ description: '페이지당 갯수', required: false })
  perPage: number;
}
