import { CreateDateColumn, DeleteDateColumn, UpdateDateColumn } from 'typeorm';

export class BaseEntity {
  @CreateDateColumn({ type: 'datetime', name: 'CREATE_AT' })
  createAt: Date;

  @UpdateDateColumn({ type: 'datetime', name: 'UPDATE_AT' })
  updateAt: Date;

  @DeleteDateColumn({ type: 'datetime', name: 'DELETE_AT', select: false })
  deleteAt: Date;
}
