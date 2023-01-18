import { ApiProperty } from '@nestjs/swagger';

export class SearchCsDto {
  @ApiProperty({ description: 'type', enum: ['notice', 'faq'] })
  type: string;
}
