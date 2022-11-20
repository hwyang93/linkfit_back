import { BaseEntity } from './BaseEntity';
import {
  Column,
  Entity,
  JoinColumn,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { CommonFile } from './CommonFile';
import { Member } from './Member';

@Entity({ name: 'MEMBER_REPUTATION' })
export class MemberReputation extends BaseEntity {
  @PrimaryGeneratedColumn({ type: 'int', name: 'SEQ' })
  seq: number;

  @Column({ type: 'int', name: 'SCORE' })
  score: number;

  @Column({ type: 'varchar', length: 2000, name: 'COMMENT' })
  comment: number;

  @OneToOne(() => Member)
  @JoinColumn({ name: 'EVALUATION_MEMBER_SEQ' })
  evaluationMember: Member;

  @OneToOne(() => Member)
  @JoinColumn({ name: 'TARGET_MEMBER_SEQ' })
  targetMember: Member;
}
