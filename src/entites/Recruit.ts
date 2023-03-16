import { BaseEntity } from './BaseEntity';
import { Column, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Member } from './Member';
import { RecruitDate } from './RecruitDate';
import { RecruitFavorite } from './RecruitFavorite';

@Entity('RECRUIT')
export class Recruit extends BaseEntity {
  @PrimaryGeneratedColumn({ type: 'int', name: 'SEQ' })
  seq: number;

  @Column({ type: 'varchar', length: 100, name: 'TITLE' })
  title: string;

  @Column({ type: 'varchar', length: 60, name: 'COMPANY_NAME' })
  companyName: string;

  @Column({ type: 'varchar', length: 20, name: 'POSITION' })
  position: string;

  @Column({ type: 'varchar', length: 255, name: 'ADDRESS' })
  address: string;

  @Column({ type: 'varchar', length: 40, name: 'ADDRESS_DETAIL' })
  addressDetail: string;

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

  @Column({ type: 'double', name: 'LON' })
  lon: number;

  @Column({ type: 'double', name: 'LAT' })
  lat: number;

  @Column({ type: 'int', name: 'WRITER_SEQ' })
  writerSeq: number;

  @ManyToOne(() => Member)
  @JoinColumn([{ name: 'WRITER_SEQ' }])
  writer: Member;

  @OneToMany(() => RecruitDate, RecruitDate => RecruitDate.recruit)
  dates: RecruitDate[];

  @OneToMany(() => RecruitFavorite, RecruitFavorite => RecruitFavorite.recruit)
  bookmarks: RecruitFavorite[];
}
