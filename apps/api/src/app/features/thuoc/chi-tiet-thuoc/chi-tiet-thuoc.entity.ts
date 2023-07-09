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
import { NhapKhoThuoc } from '../nhap-kho-thuoc/nhap-kho-thuoc.entity';
import { Thuoc } from '../thuoc.entity';

@Entity('chiTietThuoc')
export class ChiTietThuoc extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  nhapKhoThuocId: number;

  @ManyToOne(type => NhapKhoThuoc)
  @JoinColumn()
  nhapKhoThuoc: NhapKhoThuoc;

  @Column()
  thuocId: number;

  @ManyToOne(type => Thuoc)
  @JoinColumn()
  thuoc: Thuoc;

  @Column()
  soLuong: number;

  @Column()
  soLuongConLai: number;

  @Column()
  giaNhap: number;

  @Column('datetime')
  ngayHetHan: Date;

  @Column()
  tongNhap: number;

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
