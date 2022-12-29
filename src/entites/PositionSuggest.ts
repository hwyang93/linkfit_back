import { BaseEntity } from './BaseEntity';
import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('POSITION_SUGGEST')
export class PositionSuggest extends BaseEntity {
  @PrimaryGeneratedColumn({ type: 'int', name: 'SEQ' })
  seq: number;

  @Column({ type: 'varchar', length: 100, name: 'TITLE' })
  title: string;

  @Column({ type: 'varchar', length: 2000, name: 'CONTENTS' })
  contents: string;

  @Column({ type: 'int', name: 'RECRUIT_SEQ' })
  recruitSeq: number;

  @Column({ type: 'datetime', name: 'CLOSING_DATE' })
  closingDate: string;

  @Column({ type: 'int', name: 'SUGGEST_MEMBER_SEQ' })
  suggestMemberSeq: number;

  @Column({ type: 'int', name: 'TARGET_MEMBER_SEQ' })
  targetMemberSeq: number;

  @Column({ type: 'varchar', length: 10, name: 'STATUS' })
  status: string;
}
