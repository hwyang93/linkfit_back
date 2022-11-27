import { BaseEntity } from './BaseEntity';
import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('RECRUIT_APPLY')
export class RecruitApply extends BaseEntity {
  @PrimaryGeneratedColumn({ type: 'int', name: 'SEQ' })
  seq: number;

  @Column({ type: 'int', name: 'MEMBER_SEQ' })
  memberSeq: number;

  @Column({ type: 'int', name: 'MEMBER_SEQ' })
  recruitSeq: number;

  @Column({ type: 'int', name: 'MEMBER_SEQ' })
  recruitDateSeq: number;

  @Column({ type: 'varchar', length: 10, name: 'MEMBER_SEQ' })
  status: string;
}
