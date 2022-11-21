import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { BaseEntity } from './BaseEntity';

@Entity({ name: 'COMMON_FILE' })
export class CommonFile extends BaseEntity {
  @PrimaryGeneratedColumn({ type: 'int', name: 'SEQ' })
  seq: number;

  @Column({ type: 'int', name: 'MEMBER_SEQ' })
  memberSeq: string;

  @Column({ type: 'varchar', length: 10, name: 'UPLOAD_DIR' })
  uploadDir: string;

  @Column({ type: 'varchar', length: 50, name: 'ORIGIN_FILE_NAME' })
  originFileName: string;

  @Column({ type: 'varchar', length: 50, name: 'UPLOAD_FILE_NAME' })
  uploadFileName: string;

  @Column({ type: 'varchar', length: 10, name: 'EXTENSION' })
  extension: string;
}
