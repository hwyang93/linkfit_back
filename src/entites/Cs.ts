import { BaseEntity } from './BaseEntity';
import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('CS')
export class Cs extends BaseEntity {
  @PrimaryGeneratedColumn({ type: 'int', name: 'SEQ' })
  seq: number;

  @Column({ type: 'varchar', length: 20, name: 'TYPE' })
  type: string;

  @Column({ type: 'varchar', length: 100, name: 'TITLE' })
  title: string;

  @Column({ type: 'int', name: 'WRITER_SEQ' })
  writerSeq: number;

  @Column({ type: 'varchar', length: 20, name: 'WRITER_ID' })
  writeId: string;

  @Column({ type: 'varchar', length: 2000, name: 'CONTENT' })
  content: string;
}
