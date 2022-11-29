import { ApiProperty } from '@nestjs/swagger';

export class CreateRecruitDateDto {
  @ApiProperty({ description: '일자' })
  day: string;

  @ApiProperty({ description: '시간' })
  time: string;
}
