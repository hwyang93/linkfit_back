import { Column, Entity, JoinColumn, ManyToOne, OneToOne, PrimaryGeneratedColumn } from 'typeorm';
import { BaseEntity } from './BaseEntity';
import { Member } from './Member';

@Entity({ name: 'REGION_AUTH' })
export class RegionAuth extends BaseEntity {
  @PrimaryGeneratedColumn({ type: 'int', name: 'SEQ' })
  seq: number;

  @Column({ type: 'int', name: 'MEMBER_SEQ' })
  memberSeq: number;

  @Column({ type: 'double', name: 'LON' })
  lon: number;

  @Column({ type: 'double', name: 'LAT' })
  lat: number;

  @Column({ type: 'varchar', length: 50, name: 'REGION_1DEPTH' })
  region1depth: string;

  @Column({ type: 'varchar', length: 50, name: 'REGION_2DEPTH' })
  region2depth: string;

  @Column({ type: 'varchar', length: 50, name: 'REGION_3DEPTH' })
  region3depth: string;

  @OneToOne(() => Member, Member => Member.regionAuth)
  @JoinColumn([{ name: 'MEMBER_SEQ' }])
  member: Member;
}
