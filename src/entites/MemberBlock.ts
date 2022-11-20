import { BaseEntity } from './BaseEntity';
import {
  Column,
  Entity,
  JoinColumn,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Member } from './Member';

@Entity({ name: 'MEMBER_BLOCK' })
export class MemberBlock extends BaseEntity {
  @PrimaryGeneratedColumn({ type: 'int', name: 'SEQ' })
  seq: number;

  @OneToOne(() => Member)
  @JoinColumn({ name: 'MEMBER_SEQ' })
  member: Member;

  @OneToOne(() => Member)
  @JoinColumn({ name: 'TARGET_MEMBER_SEQ' })
  targetMember: Member;
}
