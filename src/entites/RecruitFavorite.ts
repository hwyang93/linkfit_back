import { BaseEntity } from './BaseEntity';
import { Column, Entity, JoinColumn, ManyToOne, OneToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Recruit } from './Recruit';

@Entity('RECRUIT_FAVORITE')
export class RecruitFavorite extends BaseEntity {
  @PrimaryGeneratedColumn({ type: 'int', name: 'SEQ' })
  seq: number;

  @Column({ type: 'int', name: 'MEMBER_SEQ' })
  memberSeq: number;

  @Column({ type: 'int', name: 'FAVORITE_SEQ' })
  favoriteSeq: number;

  @ManyToOne(() => Recruit, Recruit => Recruit.bookmarks)
  @JoinColumn([{ name: 'FAVORITE_SEQ' }])
  recruit: Recruit;
}
