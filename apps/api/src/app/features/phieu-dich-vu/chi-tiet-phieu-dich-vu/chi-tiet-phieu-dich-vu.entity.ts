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
import { PhieuDichVu } from '../phieu-dich-vu.entity';
import { DichVu } from '../../dich-vu/dich-vu.entity';

@Entity('chiTietPhieuDichVu')
export class ChiTietPhieuDichVu extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  phieuDichVuId: number;

  @Column()
  dichVuId: number;

  @ManyToOne(type => PhieuDichVu)
  @JoinColumn()
  phieuDichVu: PhieuDichVu;

  @ManyToOne(type => DichVu)
  @JoinColumn()
  dichVu: DichVu;

  @Column()
  soLuong: number;

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
