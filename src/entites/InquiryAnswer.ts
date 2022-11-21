import {
  BaseEntity,
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Inquiry } from './Inquiry';
import { Member } from './Member';

@Entity('INQUIRY_ANSWER')
export class InquiryAnswer extends BaseEntity {
  @PrimaryGeneratedColumn({ type: 'int', name: 'SEQ' })
  seq: number;

  @Column({ type: 'varchar', length: 20, name: 'TYPE' })
  type: string;

  @Column({ type: 'varchar', length: 2000, name: 'CONTENT' })
  content: string;

  @ManyToOne(() => Inquiry, (Inquiry) => Inquiry.answers)
  @JoinColumn([{ name: 'INQUIRY_SEQ' }])
  inquiry: Inquiry;

  @ManyToOne(() => Member)
  @JoinColumn([{ name: 'WRITER_SEQ' }])
  writer: Member;
}
