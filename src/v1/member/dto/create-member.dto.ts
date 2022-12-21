import { ApiProperty } from '@nestjs/swagger';
import { CreateCompanyDto } from './create-company.dto';
import { Member } from '../../../entites/Member';

export class CreateMemberDto {
  @ApiProperty({ description: '이메일' })
  email: string;

  @ApiProperty({ description: '비밀번호' })
  password: string;

  @ApiProperty({ description: '이름' })
  name: string;

  @ApiProperty({ description: '생년월일' })
  birth: string;

  @ApiProperty({ description: '성별' })
  gender: string;

  @ApiProperty({ description: '연락처' })
  phone: string;

  @ApiProperty({ description: '회원구분' })
  type: string;

  @ApiProperty({ description: '닉네임' })
  nickname: string;

  @ApiProperty({ description: '주소' })
  address: string;

  @ApiProperty({ description: '상세주소' })
  addressDetail: string;

  @ApiProperty({ description: '업체정보' })
  company: CreateCompanyDto;

  toEntity() {
    const entity = new Member();
    entity.email = this?.email;
    entity.name = this?.name;
    entity.birth = this?.birth;
    entity.gender = this?.gender;
    entity.phone = this?.phone;
    entity.type = this?.type;
    entity.nickname = this?.nickname;
    entity.address = this?.address;
    entity.addressDetail = this?.addressDetail;

    return entity;
  }
}
