import { Column, Entity, JoinColumn, OneToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Member } from './Member';
import { BaseEntity } from './BaseEntity';
import { CreateCompanyDto } from '../v1/member/dto/create-company.dto';

@Entity({ name: 'COMPANY' })
export class Company extends BaseEntity {
  constructor(createCompanyDto: CreateCompanyDto) {
    super();
    this.companyName = createCompanyDto?.companyName;
    this.businessNumber = createCompanyDto?.businessNumber;
    this.field = createCompanyDto?.field;
    this.address = createCompanyDto?.address;
    this.addressDetail = createCompanyDto?.addressDetail;
    this.phone = createCompanyDto?.phone;
    this.owner = createCompanyDto?.owner;
  }

  @PrimaryGeneratedColumn({ type: 'int', name: 'SEQ' })
  seq: number;

  @Column({ type: 'int', name: 'MEMBER_SEQ' })
  memberSeq: number;

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
  owner: string;

  @Column({ type: 'text', name: 'INTRO', nullable: true })
  intro: string;

  @Column({ type: 'double', name: 'LON' })
  lon: number;

  @Column({ type: 'double', name: 'LAT' })
  lat: number;

  @OneToOne(() => Member, Member => Member.company)
  @JoinColumn([{ name: 'MEMBER_SEQ' }])
  member: Member;
}
