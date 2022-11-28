import { ApiProperty } from '@nestjs/swagger';

export class UpdateRecruitApplyDto {
  @ApiProperty({ description: '구인공고지원 상태' })
  status: string;
}
