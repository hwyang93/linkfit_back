import { Column, Entity, JoinColumn, OneToOne, PrimaryGeneratedColumn } from 'typeorm';
import { CommonFile } from './CommonFile';

@Entity({ name: 'MEMBER_ALBUM' })
export class MemberAlbum {
  @PrimaryGeneratedColumn({ type: 'int', name: 'SEQ' })
  seq: number;

  @Column({ type: 'int', name: 'MEMBER_SEQ' })
  memberSeq: number;

  @Column({ type: 'int', name: 'ALBUM_FILE_SEQ' })
  albumFileSeq: number;

  @OneToOne(() => CommonFile)
  @JoinColumn([{ name: 'ALBUM_FILE_SEQ' }])
  image: CommonFile;
}
