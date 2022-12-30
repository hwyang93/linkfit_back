import { ApiProperty } from '@nestjs/swagger';
import { PositionSuggest } from '../../../entites/PositionSuggest';

export class CreateInstructorSuggestDto {
  @ApiProperty({ description: '제목' })
  title: string;

  @ApiProperty({ description: '내용' })
  contents: string;

  @ApiProperty({ description: '구인 공고 고유번호 ' })
  recruitSeq: number;

  @ApiProperty({ description: '마감일' })
  closingDate: Date;

  @ApiProperty({ description: '대상 사용자 고유번호' })
  targetMemberSeq: number;

  toEntity() {
    const entity = new PositionSuggest();
    entity.title = this.title;
    entity.contents = this.contents;
    entity.recruitSeq = this.recruitSeq;
    entity.closingDate = this.closingDate;
    entity.targetMemberSeq = this.targetMemberSeq;

    return entity;
  }
}
