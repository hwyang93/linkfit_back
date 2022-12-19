import { Career } from '../../../entites/Career';
import { ApiProperty } from '@nestjs/swagger';
import { CreateRecruitDateDto } from '../../recruit/dto/create-recruit-date.dto';
import { CreateCareerDto } from './create-career.dto';

export class CreateResumeDto {
  title: string;

  name: string;

  birth: string;

  address: string;

  addressDetail: string;

  intro: string;

  hopePay: string;

  hopeArea: string;

  hopeTime: string;

  hopeWorkType: string;

  isMaster: string;

  isOpen: string;

  memberSeq: number;

  @ApiProperty({ description: '경력', type: () => Array(CreateCareerDto) })
  careers: Career[];
}
