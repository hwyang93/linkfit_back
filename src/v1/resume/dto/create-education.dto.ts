import { ApiProperty } from '@nestjs/swagger';

export class CreateEducationDto {
  @ApiProperty({ description: '학교명' })
  school: string;

  @ApiProperty({ description: '전공' })
  major: string;

  @ApiProperty({ description: '입학년월' })
  startDate: string;

  @ApiProperty({ description: '졸업년월' })
  endDate: string;

  @ApiProperty({ description: '상태' })
  status: string;
}
