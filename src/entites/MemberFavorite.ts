import { BaseEntity } from './BaseEntity';
import { Column, Entity, JoinColumn, OneToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Member } from './Member';

@Entity('MEMBER_FAVORITE')
export class MemberFavorite extends BaseEntity {
  @PrimaryGeneratedColumn({ type: 'int', name: 'SEQ' })
  seq: number;

  @Column({ type: 'int', name: 'MEMBER_SEQ' })
  memberSeq: number;

  @Column({ type: 'int', name: 'FAVORITE_SEQ' })
  favoriteSeq: number;

  // @OneToOne(() => Member)
  // @JoinColumn([{ name: 'FAVORITE_SEQ' }])
  // member: Member;
}
