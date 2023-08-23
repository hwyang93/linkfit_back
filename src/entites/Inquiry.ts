import { Column, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { BaseEntity } from './BaseEntity';
import { InquiryAnswer } from './InquiryAnswer';
import { Member } from './Member';

@Entity('INQUIRY')
export class Inquiry extends BaseEntity {
  @PrimaryGeneratedColumn({ type: 'int', name: 'SEQ' })
  seq: number;

  @Column({ type: 'int', name: 'WRITER_SEQ' })
  writerSeq: number;

  @Column({ type: 'varchar', length: 100, name: 'TITLE' })
  title: string;

  @Column({ type: 'varchar', length: 2000, name: 'CONTENTS' })
  contents: string;

  @Column({ type: 'varchar', length: 10, name: 'STATUS' })
  status: string;

  @OneToMany(() => InquiryAnswer, InquiryAnswer => InquiryAnswer.inquiry)
  answers: InquiryAnswer[];

  @ManyToOne(() => Member)
  @JoinColumn([{ name: 'WRITER_SEQ' }])
  writer: Member;
}
