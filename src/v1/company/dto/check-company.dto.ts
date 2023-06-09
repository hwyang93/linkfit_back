import { ApiProperty } from '@nestjs/swagger';

export class CheckCompanyDto {
  @ApiProperty({ description: '사업자번호', example: '7093101319' })
  businessNumber: string;

  @ApiProperty({ description: '개업일자', example: '20230120' })
  startDate: string;

  @ApiProperty({ description: '대표자명', example: '정지훈' })
  owner: string;
}
