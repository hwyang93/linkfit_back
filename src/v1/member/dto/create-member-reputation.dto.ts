import { ApiProperty } from '@nestjs/swagger';
import { MemberReputation } from '../../../entites/MemberReputation';

export class CreateMemberReputationDto {
  @ApiProperty({ description: '구인 공고 고유 번호' })
  recruitSeq: number;

  @ApiProperty({ description: '후기' })
  comment: string;

  @ApiProperty({ description: '평가 회원 고유 번호' })
  evaluationMemberSeq: number;

  @ApiProperty({ description: '대상 회원 고유 번호' })
  targetMemberSeq: number;

  toEntity() {
    const entity = new MemberReputation();
    entity.comment = this.comment;
    entity.evaluationMemberSeq = this.evaluationMemberSeq;
    entity.targetMemberSeq = this.targetMemberSeq;
    return entity;
  }
}
