import { BaseEntity } from './BaseEntity';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Member } from './Member';
import { SeekDate } from './SeekDate';

@Entity('SEEK')
export class Seek extends BaseEntity {
  @PrimaryGeneratedColumn({ type: 'int', name: 'SEQ' })
  seq: number;

  @Column({ type: 'varchar', length: 60, name: 'TITLE' })
  companyName: string;

  @Column({ type: 'varchar', length: 255, name: 'FIELD' })
  address: string;

  @Column({ type: 'varchar', length: 30, name: 'SEEK_TYPE' })
  district: string;

  @Column({ type: 'varchar', length: 10, name: 'PAY_TYPE' })
  payType: string;

  @Column({ type: 'varchar', length: 10, name: 'PAY' })
  pay: string;

  @Column({ type: 'varchar', length: 2000, name: 'CONTENT' })
  content: string;

  @ManyToOne(() => Member)
  @JoinColumn([{ name: 'WRITER_SEQ' }])
  writer: Member;

  @OneToMany(() => SeekDate, (SeekDate) => SeekDate.seek)
  dates: SeekDate[];
}
