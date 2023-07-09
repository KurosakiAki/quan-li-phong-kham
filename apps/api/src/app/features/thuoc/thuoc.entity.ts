import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  BaseEntity,
  DeleteDateColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('thuoc')
export class Thuoc extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 255 })
  tenThuoc: string;

  @Column({ length: 20 })
  donVi: string;

  @Column()
  donGia: number;

  @Column()
  tonKho: number;

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
