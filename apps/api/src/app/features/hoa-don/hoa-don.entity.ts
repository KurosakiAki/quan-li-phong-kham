import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  BaseEntity,
  DeleteDateColumn,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { KhachHang } from '../khach-hang/khach-hang.entity';

@Entity('hoaDon')
export class HoaDon extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  khachHangId: number;

  @ManyToOne(type => KhachHang)
  @JoinColumn()
  khachHang: KhachHang;

  @Column({ length: 20 })
  maHoaDon: string;

  @Column()
  tongTien: number;

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
