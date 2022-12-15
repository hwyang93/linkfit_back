import { BaseEntity } from './BaseEntity';
import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Recruit } from './Recruit';

@Entity('RECRUIT_DATE')
export class RecruitDate extends BaseEntity {
  @PrimaryGeneratedColumn({ type: 'int', name: 'SEQ' })
  seq: number;

  @Column({ type: 'varchar', length: 15, name: 'DAY' })
  day: string;

  @Column({ type: 'varchar', length: 10, name: 'TIME' })
  time: string;

  @Column({ type: 'int', name: 'RECRUIT_SEQ' })
  recruitSeq: number;

  @ManyToOne(() => Recruit, Recruit => Recruit.dates)
  @JoinColumn([{ name: 'RECRUIT_SEQ' }])
  recruit: Recruit;
}
