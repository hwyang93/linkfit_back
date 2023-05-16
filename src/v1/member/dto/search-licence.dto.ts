import { ApiProperty } from '@nestjs/swagger';

export class SearchLicenceDto {
  @ApiProperty({ description: '진행 여부', required: false })
  status: string;
}
