import { ApiProperty } from '@nestjs/swagger';

export class SearchCsDto {
  @ApiProperty({ description: 'type', enum: ['NOTICE', 'FAQ'] })
  type: string;
}
