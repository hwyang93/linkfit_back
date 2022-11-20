import {
  Column,
  Entity,
  JoinColumn,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { CommonFile } from './CommonFile';

@Entity({ name: 'MEMBER_ALBUM' })
export class MemberAlbum {
  @PrimaryGeneratedColumn({ type: 'int', name: 'SEQ' })
  seq: number;

  @Column({ type: 'int', name: 'MEMBER_SEQ' })
  memberSeq: string;

  @OneToOne(() => CommonFile)
  @JoinColumn({ name: 'COMMON_FILE_SEQ' })
  image: CommonFile;
}
