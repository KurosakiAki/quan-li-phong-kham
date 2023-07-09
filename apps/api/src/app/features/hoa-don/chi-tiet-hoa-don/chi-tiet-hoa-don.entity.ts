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
import { HoaDon } from '../hoa-don.entity';
import { Thuoc } from '../../thuoc/thuoc.entity';
import { DichVu } from '../../dich-vu/dich-vu.entity';

@Entity('chiTietHoaDon')
export class ChiTietHoaDon extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  hoaDonId: number;

  @ManyToOne(type => HoaDon)
  @JoinColumn()
  hoaDon: HoaDon;

  @Column()
  thuocId: number;

  @ManyToOne(type => Thuoc)
  @JoinColumn()
  thuoc: Thuoc;

  @Column()
  dichVuId: number;

  @ManyToOne(type => DichVu)
  @JoinColumn()
  dichVu: DichVu;

  @Column()
  soLuong: number;

  @Column()
  thanhTien: number;

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
