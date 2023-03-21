import { BaseEntity } from './BaseEntity';
import { Column, Entity, JoinColumn, ManyToMany, ManyToOne, OneToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Member } from './Member';

@Entity('MEMBER_FAVORITE')
export class MemberFavorite extends BaseEntity {
  @PrimaryGeneratedColumn({ type: 'int', name: 'SEQ' })
  seq: number;

  @Column({ type: 'int', name: 'MEMBER_SEQ' })
  memberSeq: number;

  @Column({ type: 'int', name: 'FAVORITE_SEQ' })
  favoriteSeq: number;

  @ManyToOne(() => Member, Member => Member.follower)
  @JoinColumn([{ name: 'FAVORITE_SEQ' }])
  followingMember: Member;
}
