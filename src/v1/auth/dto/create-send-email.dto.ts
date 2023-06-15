import { ApiProperty } from '@nestjs/swagger';
import { EmailAuth } from '../../../entites/EmailAuth';

export class CreateSendEmailDto {
  @ApiProperty({ description: '보낼 이메일 주소' })
  email: string;

  toEntity() {
    const entity = new EmailAuth();
    entity.sendToEmail = this.email;
    return entity;
  }
}
