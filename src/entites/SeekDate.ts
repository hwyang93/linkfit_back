import { BaseEntity } from './BaseEntity';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Seek } from './Seek';

@Entity('SEEK_DATE')
export class SeekDate extends BaseEntity {
  @PrimaryGeneratedColumn({ type: 'int', name: 'SEQ' })
  seq: number;

  @Column({ type: 'varchar', length: 15, name: 'DAT' })
  day: string;

  @Column({ type: 'varchar', length: 10, name: 'TIME' })
  time: string;

  @ManyToOne(() => Seek, (Seek) => Seek.dates)
  @JoinColumn([{ name: 'SEEK_SEQ' }])
  seek: Seek;
}
