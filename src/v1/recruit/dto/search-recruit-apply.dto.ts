import { ApiProperty } from '@nestjs/swagger';

export class SearchRecruitApplyDto {
  @ApiProperty({ description: '기간', enum: ['ONE_WEEK', 'ONE_MONTH', 'TWO_MONTH', 'THREE_MONTH'], required: false })
  period: string;

  @ApiProperty({ description: '진행 여부', enum: ['APPLY', 'CANCEL', 'VIEWED', 'NOT_VIEWED', 'PASS', 'FAIL'], required: false })
  status: string;
}
