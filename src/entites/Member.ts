import {Column, Entity, JoinColumn, OneToOne, PrimaryGeneratedColumn} from 'typeorm';
import { BaseEntity } from './BaseEntity';
import { CommonFile } from './CommonFile';
import { Company } from './Company';

@Entity({ name: 'MEMBER' })
export class Member extends BaseEntity {
  @PrimaryGeneratedColumn({ type: 'int', name: 'SEQ' })
  seq: number;

  @Column({ type: 'varchar', length: 255, name: 'PASSWORD' })
  password: string;

  @Column({ type: 'varchar', length: 60, name: 'NAME' })
  name: string;

  @Column({ type: 'varchar', length: 10, name: 'BIRTH' })
  birth: string;

  @Column({ type: 'varchar', length: 10, name: 'GENDER' })
  GENDER: string;

  @Column({ type: 'varchar', length: 50, name: 'EMAIL' })
  email: string;

  @Column({ type: 'varchar', length: 15, name: 'PHONE' })
  phone: string;

  @Column({
    type: 'varchar',
    length: 10,
    name: 'TYPE',
    nullable: true,
    default: '',
  })
  type: string;

  @Column({ type: 'varchar', length: 60, name: 'NICKNAME', nullable: true })
  nickname: string;

  @Column({ type: 'text', name: 'INTRO' })
  intro: string;

  @Column({ type: 'varchar', length: 255, name: 'ADDRESS', nullable: true })
  address: string;

  @Column({
    type: 'varchar',
    length: 40,
    name: 'ADDRESS_DETAIL',
    nullable: true,
  })
  addressDetail: string;

  @Column({ type: 'datetime', nullable: true })
  lastLogin: string;

  @Column({
    type: 'varchar',
    length: 10,
    name: 'STATUS',
    default: 'PUBLIC',
    nullable: true,
  })
  status: string;

  @OneToOne(() => CommonFile)
  @JoinColumn({ name: 'PROFILE_FILE_SEQ' })
  profileImage: CommonFile;

  @OneToOne(() => Company, (Company) => Company.member)
  company: Company;
}
