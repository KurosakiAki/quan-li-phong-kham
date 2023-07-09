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
import { LichKham } from '../lich-kham/lich-kham.entity';

@Entity('donThuoc')
export class DonThuoc extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 20 })
  maDonThuoc: string;

  @Column({ length: 20 })
  maHoaDon: string;

  @Column()
  lichKhamId: number;

  @ManyToOne(type => LichKham)
  @JoinColumn()
  lichKham: LichKham;

  @Column({ length: 255 })
  loiDan: string;

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
