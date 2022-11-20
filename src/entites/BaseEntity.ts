import {
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  UpdateDateColumn,
} from 'typeorm';

@Entity()
export class BaseEntity {
  @CreateDateColumn({ type: 'datetime', name: 'create_at' })
  createAt: number;

  @UpdateDateColumn({ type: 'datetime', name: 'update_at' })
  updateAt: number;

  @DeleteDateColumn({ type: 'datetime', name: 'delete_at' })
  deleteAt: number;
}
