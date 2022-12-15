import { ApiProperty } from '@nestjs/swagger';
import { RecruitDate } from '../../entites/RecruitDate';

export class CreateRecruitDateDto {
  @ApiProperty({ description: '일자' })
  day: string;

  @ApiProperty({ description: '시간' })
  time: string;

  toEntity() {
    const entity = new RecruitDate();
    entity.day = this?.day;
    entity.time = this?.time;

    return entity;
  }
}
