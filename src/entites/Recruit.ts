import { BaseEntity } from './BaseEntity';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Member } from './Member';
import { RecruitDate } from './RecruitDate';
import { CreateRecruitDto } from "../recruit/dto/create-recruit.dto";

@Entity('RECRUIT')
export class Recruit extends BaseEntity {
  constructor(dto:CreateRecruitDto) {
    super();
    this.companyName = dto?.companyName;
    this.address = dto?.address;
    this.district = dto?.district;
    this.phone = dto?.phone;
    this.recruitType = dto?.recruitType;
    this.career = dto?.career;
    this.education = dto?.education;
    this.payType = dto?.payType;
    this.pay = dto?.pay;
    this.classType = dto?.classType;
    this.content = dto?.content;
  }
  @PrimaryGeneratedColumn({ type: 'int', name: 'SEQ' })
  seq: number;

  @Column({ type: 'varchar', length: 60, name: 'COMPANY_NAME' })
  companyName: string;

  @Column({ type: 'varchar', length: 255, name: 'ADDRESS' })
  address: string;

  @Column({ type: 'varchar', length: 30, name: 'DISTRICT' })
  district: string;

  @Column({ type: 'varchar', length: 15, name: 'PHONE' })
  phone: string;

  @Column({ type: 'varchar', length: 20, name: 'RECRUIT_TYPE' })
  recruitType: string;

  @Column({ type: 'varchar', length: 10, name: 'CAREER' })
  career: string;

  @Column({ type: 'varchar', length: 10, name: 'EDUCATION' })
  education: string;

  @Column({ type: 'varchar', length: 10, name: 'PAY_TYPE' })
  payType: string;

  @Column({ type: 'varchar', length: 10, name: 'PAY' })
  pay: string;

  @Column({ type: 'varchar', length: 10, name: 'CLASS_TYPE' })
  classType: string;

  @Column({ type: 'varchar', length: 2000, name: 'CONTENT' })
  content: string;

  @Column({ type: 'varchar', length: 10, name: 'STATUS' })
  status: string;

  @ManyToOne(() => Member)
  @JoinColumn([{ name: 'WRITER_SEQ' }])
  writer: Member;

  @OneToMany(() => RecruitDate, (RecruitDate) => RecruitDate.recruit)
  dates: RecruitDate[];
}
