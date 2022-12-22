import { BaseEntity } from './BaseEntity';
import { Column, Entity, JoinColumn, ManyToOne, OneToOne, PrimaryGeneratedColumn } from 'typeorm';
import { RecruitDate } from './RecruitDate';
import { Recruit } from './Recruit';
import { Resume } from './Resume';

@Entity('RECRUIT_APPLY')
export class RecruitApply extends BaseEntity {
  @PrimaryGeneratedColumn({ type: 'int', name: 'SEQ' })
  seq: number;

  @Column({ type: 'int', name: 'MEMBER_SEQ' })
  memberSeq: number;

  @Column({ type: 'int', name: 'RESUME_SEQ' })
  resumeSeq: number;

  @Column({ type: 'int', name: 'RECRUIT_SEQ' })
  recruitSeq: number;

  @Column({ type: 'int', name: 'RECRUIT_DATE_SEQ' })
  recruitDateSeq: number;

  @Column({ type: 'varchar', length: 10, name: 'STATUS' })
  status: string;

  @OneToOne(() => Resume)
  @JoinColumn([{ name: 'RESUME_SEQ' }])
  resume: Resume;

  @ManyToOne(() => Recruit)
  @JoinColumn([{ name: 'RECRUIT_SEQ' }])
  recruit: Recruit;

  @OneToOne(() => RecruitDate)
  @JoinColumn([{ name: 'RECRUIT_DATE_SEQ' }])
  recruitDate: RecruitDate;
}
