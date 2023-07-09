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
import { BacSi } from '../bac-si/bac-si.entity';
import { KhachHang } from '../khach-hang/khach-hang.entity';

@Entity('lichKham')
export class LichKham extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  khachHangId: number;

  @Column()
  bacSiId: number;

  @ManyToOne(type => KhachHang)
  @JoinColumn()
  khachHang: KhachHang;

  @ManyToOne(type => BacSi)
  @JoinColumn()
  bacSi: BacSi;

  @Column({ length: 255 })
  tenBenhNhan: string;

  @Column({ length: 20 })
  soDienThoai: string;

  @Column({ length: 255 })
  email: string;

  @Column({ length: 255 })
  diaChi: string;

  @Column()
  thoiGianKham: Date;

  @Column({ length: 255 })
  lyDo: string;

  @Column({ length: 255 })
  chanDoan: string;

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
