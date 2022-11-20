import {Column, Entity, JoinColumn, OneToOne, PrimaryGeneratedColumn} from 'typeorm';
import { CommonFile } from './CommonFile';
import { Member } from './Member';

@Entity({ name: 'COMPANY' })
export class Company {
  @PrimaryGeneratedColumn({ type: 'int', name: 'SEQ' })
  seq: number;

  @Column({ type: 'varchar', length: 60, name: 'COMPANY_NAME' })
  companyName: string;

  @Column({ type: 'varchar', length: 15, name: 'BUSINESS_NUMBER' })
  businessNumber: string;

  @Column({ type: 'varchar', length: 20, name: 'FIELD' })
  field: string;

  @Column({ type: 'varchar', length: 255, name: 'ADDRESS' })
  address: string;

  @Column({ type: 'varchar', length: 40, name: 'ADDRESS_DETAIL' })
  addressDetail: string;

  @Column({ type: 'varchar', length: 15, name: 'PHONE' })
  phone: string;

  @Column({ type: 'varchar', length: 60, name: 'OWNER' })
  OWNER: string;

  @Column({ type: 'text', name: 'INTRO', nullable: true })
  intro: string;

  @OneToOne(() => Member, (Member) => Member.company)
  @JoinColumn({ name: 'MEMBER_SEQ' })
  member: Member;
}
