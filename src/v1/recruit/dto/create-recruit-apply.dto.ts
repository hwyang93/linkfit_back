import { ApiProperty } from '@nestjs/swagger';

export class CreateRecruitApplyDto {
  @ApiProperty({ description: '구인공고 고유번호' })
  recruitSeq: number;

  @ApiProperty({ description: '구인공고 일시 고유번호', type: () => Array(Number) })
  recruitDateSeq: number[];
}
