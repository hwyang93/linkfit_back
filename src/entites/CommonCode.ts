import { Column, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn, Tree, TreeChildren, TreeParent } from 'typeorm';
import { BaseEntity } from './BaseEntity';

@Entity('COMMON_CODE')
@Tree('closure-table')
export class CommonCode extends BaseEntity {
  @PrimaryGeneratedColumn({ type: 'int', name: 'SEQ' })
  seq: number;

  @Column({ type: 'varchar', length: 10, name: 'CODE' })
  code: string;

  @Column({ type: 'varchar', length: 50, name: 'CODE_NAME' })
  codeName: string;

  @TreeParent()
  @JoinColumn({ name: 'PARENT_SEQ' })
  parent: CommonCode;

  @TreeChildren()
  children: CommonCode[];
}
