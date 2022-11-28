import { BaseEntity } from './BaseEntity';
import { Column, Entity, JoinColumn, OneToOne, PrimaryGeneratedColumn } from 'typeorm';
import { CommonFile } from './CommonFile';
import { RecruitDate } from './RecruitDate';

@Entity('RECRUIT_APPLY')
export class RecruitApply extends BaseEntity {
  @PrimaryGeneratedColumn({ type: 'int', name: 'SEQ' })
  seq: number;

  @Column({ type: 'int', name: 'MEMBER_SEQ' })
  memberSeq: number;

  @Column({ type: 'int', name: 'RECRUIT_SEQ' })
  recruitSeq: number;

  @Column({ type: 'int', name: 'RECRUIT_DATE_SEQ' })
  recruitDateSeq: number;

  @Column({ type: 'varchar', length: 10, name: 'MEMBER_SEQ' })
  status: string;

  @OneToOne(() => RecruitDate)
  @JoinColumn([{ name: 'RECRUIT_DATE_SEQ' }])
  recruitDate: RecruitDate;
}
