import { CreateDateColumn, DeleteDateColumn, UpdateDateColumn } from 'typeorm';

export class BaseEntity {
  @CreateDateColumn({ type: 'datetime', name: 'CREATE_AT' })
  createAt: number;

  @UpdateDateColumn({ type: 'datetime', name: 'UPDATE_AT' })
  updateAt: number;

  @DeleteDateColumn({ type: 'datetime', name: 'DELETE_AT', select: false })
  deleteAt: number;
}
