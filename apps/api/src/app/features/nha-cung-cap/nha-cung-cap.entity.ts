import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  BaseEntity,
  DeleteDateColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('nhaCungCap')
export class NhaCungCap extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 255 })
  fullname: string;

  @Column({ length: 20 })
  phone: string;

  @Column({ length: 255 })
  email: string;

  @Column({ length: 255 })
  address: string;

  @DeleteDateColumn()
  deletedAt?: Date;

  /**
   * Id user thực hiện thao tác xóa
   */
  @Column()
  deletedUser?: number;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @Column()
  updatedUser: number;
}
