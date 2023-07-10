import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { BaseEntity } from './BaseEntity';

@Entity('EMAIL_AUTH')
export class EmailAuth extends BaseEntity {
  @PrimaryGeneratedColumn({ type: 'int', name: 'SEQ' })
  seq: number;

  @Column({ type: 'varchar', length: 50, name: 'SEND_TO_EMAIL' })
  sendToEmail: string;

  @Column({ type: 'char', length: 6, name: 'AUTH_NUMBER' })
  authNumber: string;

  @Column({ type: 'varchar', length: 20, name: 'ISSUE_DATE' })
  issueDate: string;

  @Column({ type: 'char', length: 1, name: 'IS_EXPIRE', default: 'N' })
  isExpire: string;
}
