import { ApiProperty } from '@nestjs/swagger';
import { Inquiry } from '../../../entites/Inquiry';

export class CreateInquiryDto {
  @ApiProperty({ description: '타이틀' })
  title: string;

  @ApiProperty({ description: '내용' })
  contents: string;

  toEntity() {
    const entity = new Inquiry();
    entity.title = this.title;
    entity.contents = this.contents;
    return entity;
  }
}
