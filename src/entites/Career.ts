import { BaseEntity } from './BaseEntity';
import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Resume } from './Resume';

@Entity('CAREER')
export class Career extends BaseEntity {
  @PrimaryGeneratedColumn({ type: 'int', name: 'SEQ' })
  seq: number;

  @Column({ type: 'varchar', length: 60, name: 'COMPANY_NAME' })
  companyName: string;

  @Column({ type: 'varchar', length: 10, name: 'START_DATE' })
  startDate: string;

  @Column({ type: 'varchar', length: 10, name: 'END_DATE', nullable: true })
  endDate: string;

  @Column({ type: 'varchar', length: 20, name: 'WORK_TYPE' })
  workType: string;

  @Column({ type: 'varchar', length: 20, name: 'FIELD' })
  field: string;

  @Column({ type: 'varchar', length: 2000, name: 'CONTENT', nullable: true })
  content: string;

  @Column({ type: 'int', name: 'RESUME_SEQ', select: false })
  resumeSeq: number;

  @Column({ type: 'int', name: 'MEMBER_SEQ', select: false })
  writerSeq: number;

  @ManyToOne(() => Resume, Resume => Resume.careers)
  @JoinColumn([{ name: 'RESUME_SEQ' }])
  resume: Resume;
}
