import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { BaseEntity } from './BaseEntity';
import { Community } from './Community';
import { Member } from './Member';

@Entity('COMMUNITY_COMMENT')
export class CommunityComment extends BaseEntity {
  @PrimaryGeneratedColumn({ type: 'int', name: 'SEQ' })
  seq: number;

  @Column({ type: 'varchar', length: 2000, name: 'CONTENTS' })
  contents: string;

  @Column({ type: 'int', name: 'COMMUNITY_SEQ' })
  communitySeq: number;

  @Column({ type: 'int', name: 'WRITER_SEQ' })
  writerSeq: number;

  @ManyToOne(() => Community, Community => Community.comments)
  @JoinColumn([{ name: 'COMMUNITY_SEQ' }])
  community: Community;

  @ManyToOne(() => Member)
  @JoinColumn([{ name: 'WRITER_SEQ' }])
  writer: Member;
}
