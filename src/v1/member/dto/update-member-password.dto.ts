import { ApiProperty } from '@nestjs/swagger';

export class UpdateMemberPasswordDto {
  @ApiProperty({ description: '이메일' })
  email: string;

  @ApiProperty({ description: '비밀번호' })
  password: string;

  @ApiProperty({ description: '변경할 비밀번호' })
  newPassword: string;

  @ApiProperty({ description: '인증번호 확인여부', enum: ['Y', 'N'] })
  isCheckAuthCode: string;
}
