import { ApiProperty } from '@nestjs/swagger';

export class CreateCareerDto {
  @ApiProperty({ description: '업체명' })
  companyName: string;

  @ApiProperty({ description: '입사년월' })
  startDate: string;

  @ApiProperty({ description: '퇴사년월' })
  endDate: string;

  @ApiProperty({ description: '근무형태' })
  workType: string;

  @ApiProperty({ description: '업종' })
  field: string;

  @ApiProperty({ description: '수업내용' })
  content: string;
}
