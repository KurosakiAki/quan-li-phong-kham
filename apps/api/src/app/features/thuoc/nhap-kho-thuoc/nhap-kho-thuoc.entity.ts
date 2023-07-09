import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  BaseEntity,
  DeleteDateColumn,
  CreateDateColumn,
  UpdateDateColumn,
  JoinColumn,
  ManyToOne,
} from 'typeorm';
import { NhaCungCap } from '../../nha-cung-cap/nha-cung-cap.entity';

@Entity('nhapKhoThuoc')
export class NhapKhoThuoc extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  nhaCungCapId: number;

  @ManyToOne(type => NhaCungCap)
  @JoinColumn()
  nhaCungCap: NhaCungCap;

  @Column()
  tongTien: number;

  @Column({ length: 20 })
  maNhapKho: string;

  @Column({ length: 255 })
  trangThai: string;

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
