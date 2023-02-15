import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { BaseEntity } from './BaseEntity';

@Entity({ name: 'COMMON_FILE' })
export class CommonFile extends BaseEntity {
  @PrimaryGeneratedColumn({ type: 'int', name: 'SEQ' })
  seq: number;

  @Column({ type: 'int', name: 'MEMBER_SEQ' })
  memberSeq: number;

  @Column({ type: 'varchar', length: 1000, name: 'ORIGIN_FILE_NAME' })
  originFileName: string;

  @Column({ type: 'varchar', length: 1000, name: 'ORIGIN_FILE_URL' })
  originFileUrl: string;

  @Column({ type: 'varchar', length: 100, name: 'THUMBNAIL_FILE_URL' })
  thumbnailFileUrl: string;
}
