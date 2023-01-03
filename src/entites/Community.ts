import { Column, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { BaseEntity } from './BaseEntity';
import { CommunityComment } from './CommunityComment';
import { Member } from './Member';

@Entity('COMMUNITY')
export class Community extends BaseEntity {
  @PrimaryGeneratedColumn({ type: 'int', name: 'SEQ' })
  seq: number;

  @Column({ type: 'varchar', length: 20, name: 'TYPE' })
  type: string;

  @Column({ type: 'varchar', length: 100, name: 'TITLE' })
  title: string;

  @Column({ type: 'varchar', length: 2000, name: 'CONTENT' })
  content: string;

  @Column({ type: 'int', name: 'VIEW_COUNT', default: () => "'0'" })
  viewCount: string;

  @OneToMany(() => CommunityComment, CommunityComment => CommunityComment.community)
  comments: CommunityComment[];

  @ManyToOne(() => Member)
  @JoinColumn([{ name: 'WRITER_SEQ' }])
  writer: Member;
}
