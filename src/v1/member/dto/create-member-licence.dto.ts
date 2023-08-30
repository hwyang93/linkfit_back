import { ApiProperty } from '@nestjs/swagger';
import { MemberLicence } from '../../../entites/MemberLicence';

export class CreateMemberLicenceDto {
  @ApiProperty({ description: '인증항목' })
  field: string;

  @ApiProperty({ description: '자격증 번호' })
  licenceNumber: string;

  @ApiProperty({ description: '발급기관' })
  issuer: string;

  @ApiProperty({ description: '발급일자' })
  issueDate: string;

  @ApiProperty({ description: '자격증 사본' })
  file: Express.MulterS3.File;

  toEntity() {
    const entity = new MemberLicence();
    entity.field = this.field;
    entity.licenceNumber = this.licenceNumber;
    entity.issuer = this.issuer;
    entity.issueDate = this.issueDate;

    return entity;
  }
}
