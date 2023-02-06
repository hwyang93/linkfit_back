import { BaseEntity } from './BaseEntity';
import { Column, Entity, JoinColumn, ManyToMany, ManyToOne, OneToMany, OneToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Member } from './Member';

@Entity({ name: 'MEMBER_REPUTATION' })
export class MemberReputation extends BaseEntity {
  @PrimaryGeneratedColumn({ type: 'int', name: 'SEQ' })
  seq: number;

  @Column({ type: 'int', name: 'SCORE' })
  score: number;

  @Column({ type: 'varchar', length: 2000, name: 'COMMENT' })
  comment: string;

  @Column({ type: 'int', name: 'EVALUATION_MEMBER_SEQ' })
  evaluationMemberSeq: number;

  @Column({ type: 'int', name: 'TARGET_MEMBER_SEQ' })
  targetMemberSeq: number;

  @ManyToOne(() => Member)
  @JoinColumn([{ name: 'EVALUATION_MEMBER_SEQ' }])
  evaluationMember: Member;

  @ManyToOne(() => Member)
  @JoinColumn([{ name: 'TARGET_MEMBER_SEQ' }])
  targetMember: Member;
}
