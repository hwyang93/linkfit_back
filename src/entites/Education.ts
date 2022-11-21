import { BaseEntity } from './BaseEntity';
import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('EDUCATION')
export class Education extends BaseEntity {
  @PrimaryGeneratedColumn({ type: 'int', name: 'SEQ' })
  seq: number;

  @Column({ type: 'varchar', length: 30, name: 'SCHOOL' })
  school: string;

  @Column({ type: 'varchar', length: 50, name: 'MAJOR' })
  major: string;

  @Column({ type: 'varchar', length: 10, name: 'START_DATE' })
  startDate: string;

  @Column({ type: 'varchar', length: 10, name: 'END_DATE', nullable: true })
  endDate: string;

  @Column({ type: 'varchar', length: 10, name: 'STATUS' })
  status: string;
}
