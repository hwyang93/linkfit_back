import { Column } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';

export class CreateCompanyDto {
  @ApiProperty({ description: '업체명' })
  companyName: string;

  @ApiProperty({ description: '사업자번호' })
  businessNumber: string;

  @ApiProperty({ description: '업종' })
  field: string;

  @ApiProperty({ description: '주소' })
  address: string;

  @ApiProperty({ description: '상세주소' })
  addressDetail: string;

  @ApiProperty({ description: '연락처' })
  phone: string;

  @ApiProperty({ description: '대표자명' })
  owner: string;
}
