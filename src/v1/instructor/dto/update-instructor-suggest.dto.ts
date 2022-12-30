import { ApiProperty } from '@nestjs/swagger';

export class UpdateInstructorSuggestDto {
  @ApiProperty({ description: '상태' })
  status: string;
}
