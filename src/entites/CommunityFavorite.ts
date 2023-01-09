import { BaseEntity } from './BaseEntity';
import { Column, Entity, JoinColumn, OneToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Community } from './Community';

@Entity('COMMUNITY_FAVORITE')
export class CommunityFavorite extends BaseEntity {
  @PrimaryGeneratedColumn({ type: 'int', name: 'SEQ' })
  seq: number;

  @Column({ type: 'int', name: 'MEMBER_SEQ' })
  memberSeq: number;

  @Column({ type: 'int', name: 'FAVORITE_SEQ' })
  favoriteSeq: number;

  @OneToOne(() => Community)
  @JoinColumn([{ name: 'FAVORITE_SEQ' }])
  community: Community;
}
