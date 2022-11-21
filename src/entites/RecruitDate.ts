import { BaseEntity } from './BaseEntity';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Recruit } from './Recruit';

@Entity('RECRUIT_DATE')
export class RecruitDate extends BaseEntity {
  @PrimaryGeneratedColumn({ type: 'int', name: 'SEQ' })
  seq: number;

  @Column({ type: 'varchar', length: 15, name: 'DAT' })
  day: string;

  @Column({ type: 'varchar', length: 10, name: 'TIME' })
  time: string;

  @ManyToOne(() => Recruit, (Recruit) => Recruit.dates)
  @JoinColumn([{ name: 'RECRUIT_SEQ' }])
  recruit: Recruit;
}
