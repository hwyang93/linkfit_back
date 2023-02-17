import { Column, Entity, OneToOne, PrimaryGeneratedColumn, JoinColumn, OneToMany } from 'typeorm';
import { BaseEntity } from './BaseEntity';
import { CommonFile } from './CommonFile';
import { Company } from './Company';
import { MemberLink } from './MemberLink';
import { RegionAuth } from './RegionAuth';
import { Resume } from './Resume';
import { Recruit } from './Recruit';
import { MemberLicence } from './MemberLicence';

@Entity({ name: 'MEMBER' })
export class Member extends BaseEntity {
  @PrimaryGeneratedColumn({ type: 'int', name: 'SEQ' })
  seq: number;

  @Column({ type: 'varchar', length: 50, name: 'EMAIL' })
  email: string;

  @Column({ type: 'varchar', length: 255, name: 'PASSWORD', select: false })
  password: string;

  @Column({ type: 'varchar', length: 60, name: 'NAME' })
  name: string;

  @Column({ type: 'varchar', length: 10, name: 'BIRTH' })
  birth: string;

  @Column({ type: 'varchar', length: 10, name: 'GENDER' })
  gender: string;

  @Column({ type: 'varchar', length: 15, name: 'PHONE' })
  phone: string;

  @Column({
    type: 'varchar',
    length: 10,
    name: 'TYPE',
    nullable: true,
    default: 'PUBLIC'
  })
  type: string;

  @Column({ type: 'varchar', length: 60, name: 'NICKNAME', nullable: true })
  nickname: string;

  @Column({ type: 'text', name: 'INTRO', nullable: true })
  intro: string;

  @Column({ type: 'varchar', length: 255, name: 'ADDRESS', nullable: true })
  address: string;

  @Column({
    type: 'varchar',
    length: 40,
    name: 'ADDRESS_DETAIL',
    nullable: true
  })
  addressDetail: string;

  @Column({ type: 'datetime', nullable: true })
  lastLogin: Date;

  @Column({
    type: 'char',
    length: 1,
    name: 'IS_OPEN_PROFILE',
    default: 'N',
    nullable: true
  })
  isOpenProfile: string;

  @Column({ type: 'varchar', length: 20, name: 'FIELD', nullable: true })
  field: string;

  @Column({
    type: 'varchar',
    length: 10,
    name: 'STATUS',
    nullable: true
  })
  status: string;

  @Column({
    type: 'char',
    length: 1,
    name: 'IS_VERIFICATION',
    default: 'N',
    nullable: true
  })
  isVerification: string;

  @OneToOne(() => CommonFile)
  @JoinColumn([{ name: 'PROFILE_FILE_SEQ' }])
  profileImage: CommonFile;

  @OneToOne(() => Company, Company => Company.member)
  company: Company;

  @OneToMany(() => MemberLink, MemberLink => MemberLink.member)
  links: MemberLink[];

  @OneToOne(() => RegionAuth, RegionAuth => RegionAuth.member)
  regionAuth: RegionAuth;

  @OneToMany(() => Resume, Resume => Resume.member)
  resumes: Resume[];

  @OneToMany(() => Recruit, Recruit => Recruit.writer)
  recruits: Recruit[];

  @OneToMany(() => MemberLicence, MemberLicence => MemberLicence.member)
  licences: MemberLicence[];
}
