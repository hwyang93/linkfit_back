import { CreateDateColumn, DeleteDateColumn, UpdateDateColumn } from 'typeorm';

export class BaseEntity {
  @CreateDateColumn({ type: 'datetime', name: 'CREATED_AT' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'datetime', name: 'UPDATED_AT' })
  updatedAt: Date;

  @DeleteDateColumn({ type: 'datetime', name: 'DELETED_AT', select: false })
  deletedAt: Date;
}
