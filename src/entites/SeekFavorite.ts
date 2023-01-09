import { BaseEntity } from './BaseEntity';
import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('SEEK_FAVORITE')
export class SeekFavorite extends BaseEntity {
  @PrimaryGeneratedColumn({ type: 'int', name: 'SEQ' })
  seq: number;

  @Column({ type: 'int', name: 'MEMBER_SEQ' })
  memberSeq: number;

  // @OneToOne(() => Community)
  // @JoinColumn([{ name: 'FAVORITE_SEQ' }])
  // community: Community;
}
