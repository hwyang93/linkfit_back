import { ApiProperty } from '@nestjs/swagger';

export class SearchSuggestDto {
  @ApiProperty({ description: '기간', required: false })
  period: string;

  @ApiProperty({ description: '진행 여부', required: false })
  status: string;
}
