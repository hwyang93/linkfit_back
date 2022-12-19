import { ApiProperty } from '@nestjs/swagger';
import { CreateRecruitDateDto } from './create-recruit-date.dto';
import { Recruit } from '../../../entites/Recruit';

export class CreateRecruitDto {
  @ApiProperty({ description: '업체명' })
  companyName: string;

  @ApiProperty({ description: '주소' })
  address: string;

  @ApiProperty({ description: '근무지역' })
  district: string;

  @ApiProperty({ description: '연락처' })
  phone: string;

  @ApiProperty({ description: '채용형태' })
  recruitType: string;

  @ApiProperty({ description: '경력' })
  career: string;

  @ApiProperty({ description: '학력' })
  education: string;

  @ApiProperty({ description: '급여형태' })
  payType: string;

  @ApiProperty({ description: '급여' })
  pay: string;

  @ApiProperty({ description: '수업형태' })
  classType: string;

  @ApiProperty({ description: '내용' })
  content: string;

  @ApiProperty({ description: '구직일시', type: () => Array(CreateRecruitDateDto) })
  dates: CreateRecruitDateDto[];

  toEntity() {
    const entity = new Recruit();
    entity.companyName = this?.companyName;
    entity.address = this?.address;
    entity.district = this?.district;
    entity.phone = this?.phone;
    entity.recruitType = this?.recruitType;
    entity.career = this?.career;
    entity.education = this?.education;
    entity.payType = this?.payType;
    entity.pay = this?.pay;
    entity.classType = this?.classType;
    entity.content = this?.content;

    return entity;
  }
}