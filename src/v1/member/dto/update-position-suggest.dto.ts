import { ApiProperty } from '@nestjs/swagger';

export class UpdatePositionSuggestDto {
  @ApiProperty({ description: '상태' })
  status: string;
}
