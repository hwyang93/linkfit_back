import { Column, Entity, JoinColumn, ManyToOne, OneToOne, PrimaryGeneratedColumn } from 'typeorm';
import { BaseEntity } from './BaseEntity';
import { CommonFile } from './CommonFile';
import { Seek } from './Seek';
import { Member } from './Member';

@Entity({ name: 'MEMBER_LICENCE' })
export class MemberLicence extends BaseEntity {
  @PrimaryGeneratedColumn({ type: 'int', name: 'SEQ' })
  seq: number;

  @Column({ type: 'int', name: 'MEMBER_SEQ' })
  memberSeq: number;

  @Column({ type: 'varchar', length: 20, name: 'FIELD' })
  field: string;

  @Column({ type: 'varchar', length: 20, name: 'LICENCE_NUMBER' })
  licenceNumber: string;

  @Column({ type: 'varchar', length: 30, name: 'ISSUER' })
  issuer: string;

  @Column({ type: 'varchar', length: 10, name: 'STATUS' })
  status: string;

  @Column({ type: 'int', name: 'LICENCE_FILE_SEQ', nullable: true })
  licenceFileSeq: number;

  @OneToOne(() => CommonFile)
  @JoinColumn([{ name: 'LICENCE_FILE_SEQ' }])
  licenceFile: CommonFile;

  @ManyToOne(() => Member, Member => Member.licences)
  @JoinColumn([{ name: 'MEMBER_SEQ' }])
  member: Member;
}
