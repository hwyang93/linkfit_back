import { BaseEntity } from './BaseEntity';
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Career } from './Career';

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

  @Column({ type: 'char', length: 1, name: 'IS_MASTER' })
  isMaster: string;

  @Column({ type: 'char', length: 1, name: 'IS_OPEN' })
  isOpen: string;

  @OneToMany(() => Career, (Career) => Career.resume)
  careers: Career[];
}
