import { BaseEntity } from './BaseEntity';
import { Column, Entity, JoinColumn, ManyToMany, ManyToOne, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Career } from './Career';
import { Education } from './Education';
import { Member } from './Member';
import { MemberLicence } from './MemberLicence';

@Entity('RESUME')
export class Resume extends BaseEntity {
  @PrimaryGeneratedColumn({ type: 'int', name: 'SEQ' })
  seq: number;

  @Column({ type: 'varchar', length: 100, name: 'TITLE' })
  title: string;

  @Column({ type: 'varchar', length: 60, name: 'NAME' })
  name: string;

  @Column({ type: 'varchar', length: 10, name: 'BIRTH' })
  birth: string;

  @Column({ type: 'varchar', length: 255, name: 'ADDRESS' })
  address: string;

  @Column({ type: 'varchar', length: 40, name: 'ADDRESS_DETAIL' })
  addressDetail: string;

  @Column({ type: 'varchar', length: 2000, name: 'INTRO' })
  intro: string;

  @Column({ type: 'varchar', length: 10, name: 'HOPE_PAY' })
  hopePay: string;

  @Column({ type: 'varchar', length: 30, name: 'HOPE_AREA' })
  hopeArea: string;

  @Column({ type: 'varchar', length: 10, name: 'HOPE_TIME' })
  hopeTime: string;

  @Column({ type: 'varchar', length: 20, name: 'HOPE_WORK_TYPE' })
  hopeWorkType: string;

  @Column({ type: 'char', length: 1, name: 'IS_MASTER', default: 'N' })
  isMaster: string;

  @Column({ type: 'char', length: 1, name: 'IS_OPEN', default: 'N' })
  isOpen: string;

  @Column({ type: 'int', name: 'WRITER_SEQ' })
  writerSeq: number;

  @Column({ type: 'int', name: 'LICENCE_SEQ' })
  licenceSeq: number;

  @OneToMany(() => Career, Career => Career.resume)
  careers: Career[];

  @OneToMany(() => Education, Education => Education.resume)
  educations: Education[];

  @ManyToOne(() => MemberLicence)
  @JoinColumn([{ name: 'LICENCE_SEQ' }])
  licence: MemberLicence;

  @ManyToOne(() => Member, Member => Member.resumes)
  @JoinColumn([{ name: 'WRITER_SEQ' }])
  writer: Member;
}
