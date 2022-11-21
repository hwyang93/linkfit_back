import { BaseEntity } from './BaseEntity';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Member } from './Member';

@Entity('MEMBER_LINK')
export class MemberLink extends BaseEntity {
  @PrimaryGeneratedColumn({ type: 'int', name: 'SEQ' })
  seq: number;

  @Column({ type: 'varchar', length: 30, name: 'LINK_TYPE' })
  type: string;

  @Column({ type: 'varchar', length: 150, name: 'LINK_URL' })
  url: string;

  @ManyToOne(() => Member, (Member) => Member.links)
  @JoinColumn([{ name: 'MEMBER_SEQ' }])
  member: Member;
}
