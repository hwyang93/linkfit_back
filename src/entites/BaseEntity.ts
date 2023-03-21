import { Column, CreateDateColumn, DeleteDateColumn, Timestamp } from 'typeorm';

export class BaseEntity {
  @CreateDateColumn({ type: 'timestamp', name: 'CREATED_AT' })
  createdAt: Timestamp;

  @Column({ type: 'timestamp', name: 'UPDATED_AT', default: () => 'CURRENT_TIMESTAMP' })
  updatedAt: Timestamp;

  @DeleteDateColumn({ type: 'datetime', name: 'DELETED_AT', select: false })
  deletedAt: Timestamp;
}
