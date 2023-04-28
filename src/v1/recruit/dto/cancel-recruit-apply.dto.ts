import { ApiProperty } from '@nestjs/swagger';

export class CancelRecruitApplyDto {
  @ApiProperty({ description: '취소 할 지원 고유번호 목록', type: () => Array(Number) })
  recruitDateSeqs: number[];
}
