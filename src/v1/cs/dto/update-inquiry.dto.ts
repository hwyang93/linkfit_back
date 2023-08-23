import { PartialType } from '@nestjs/mapped-types';
import { CreateInquiryDto } from './create-inquiry.dto';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateInquiryDto extends PartialType(CreateInquiryDto) {
  @ApiProperty({ description: '타이틀' })
  title: string;

  @ApiProperty({ description: '내용' })
  contents: string;
}
