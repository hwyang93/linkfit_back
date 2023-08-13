import { ApiProperty } from '@nestjs/swagger';

export class UpdateMemberPasswordDto {
  @ApiProperty({ description: '비밀번호' })
  password: string;

  @ApiProperty({ description: '변경할 비밀번호' })
  newPassword: string;
}
