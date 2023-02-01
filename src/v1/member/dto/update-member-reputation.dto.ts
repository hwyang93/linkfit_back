import { ApiProperty } from '@nestjs/swagger';

export class UpdateMemberReputationDto {
  @ApiProperty({ description: '후기' })
  comment: string;
}
