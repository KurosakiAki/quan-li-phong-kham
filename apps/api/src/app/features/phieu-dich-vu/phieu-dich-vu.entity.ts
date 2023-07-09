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
import { LichKham } from '../lich-kham/lich-kham.entity';

@Entity('phieuDichVu')
export class PhieuDichVu extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 20 })
  maPhieuDichVu: string;

  @Column({ length: 20 })
  maHoaDon: string;

  @Column({ length: 255 })
  loai: string;

  @Column()
  lichKhamId: number;

  @ManyToOne(type => LichKham)
  @JoinColumn()
  lichKham: LichKham;

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
