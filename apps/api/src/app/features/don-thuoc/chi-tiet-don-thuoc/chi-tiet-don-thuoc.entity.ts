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
import { DonThuoc } from '../don-thuoc.entity';
import { Thuoc } from '../../thuoc/thuoc.entity';

@Entity('chiTietDonThuoc')
export class ChiTietDonThuoc extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  donThuocId: number;

  @Column()
  thuocId: number;

  @ManyToOne(type => DonThuoc)
  @JoinColumn()
  donThuoc: DonThuoc;

  @ManyToOne(type => Thuoc)
  @JoinColumn()
  thuoc: Thuoc;

  @Column({ length: 255 })
  cachDung: string;

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
