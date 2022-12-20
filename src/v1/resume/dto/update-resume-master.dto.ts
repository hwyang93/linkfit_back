import { ApiProperty } from '@nestjs/swagger';

export class UpdateResumeMasterDto {
  @ApiProperty({ description: '공개여부' })
  isOpen: string;
}
