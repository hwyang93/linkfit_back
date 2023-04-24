import { ApiProperty } from '@nestjs/swagger';
import { CreateCareerDto } from './create-career.dto';
import { CreateEducationDto } from './create-education.dto';
import { Resume } from '../../../entites/Resume';

export class CreateResumeDto {
  @ApiProperty({ description: '제목' })
  title: string;

  @ApiProperty({ description: '이름' })
  name: string;

  @ApiProperty({ description: '생년월일' })
  birth: string;

  @ApiProperty({ description: '주소' })
  address: string;

  @ApiProperty({ description: '상세주소' })
  addressDetail: string;

  @ApiProperty({ description: '자기소개글' })
  intro: string;

  @ApiProperty({ description: '희망 급여' })
  hopePay: string;

  @ApiProperty({ description: '희망 근무지역' })
  hopeArea: string;

  @ApiProperty({ description: '희망 근무시간' })
  hopeTime: string;

  @ApiProperty({ description: '희망 근무형태' })
  hopeWorkType: string;

  @ApiProperty({ description: '대표이력서 여부', default: 'N' })
  isMaster: string;

  @ApiProperty({ description: '공개여부', default: 'N' })
  isOpen: string;

  @ApiProperty({ description: '경력', type: () => Array(CreateCareerDto) })
  careers: CreateCareerDto[];

  @ApiProperty({ description: '학력', type: () => Array(CreateEducationDto) })
  educations: CreateEducationDto[];

  @ApiProperty({ description: '자격증 고유번호', default: 0 })
  licenceSeq: number;

  toEntity() {
    const entity = new Resume();
    entity.title = this.title;
    entity.name = this.name;
    entity.birth = this.birth;
    entity.address = this.address;
    entity.addressDetail = this.addressDetail;
    entity.intro = this.intro;
    entity.hopePay = this.hopePay;
    entity.hopeArea = this.hopeArea;
    entity.hopeTime = this.hopeTime;
    entity.hopeWorkType = this.hopeWorkType;
    entity.isMaster = this.isMaster;
    entity.isOpen = this.isOpen;
    entity.licenceSeq = this.licenceSeq;

    return entity;
  }
}
