import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  BaseEntity,
  DeleteDateColumn,
  CreateDateColumn,
  UpdateDateColumn,
  JoinColumn,
  OneToOne,
} from 'typeorm';
import { User } from '../user/user.entity';

@Entity('khachHang')
export class KhachHang extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  userId: number;

  @OneToOne(type => User)
  @JoinColumn()
  user: User;

  @Column({ length: 255 })
  fullname: string;

  @Column({ length: 20 })
  referenceId: string;

  @Column('datetime')
  birthday: Date;

  @Column({ length: 20 })
  gender: string;

  @Column({ length: 20 })
  phone: string;

  @Column({ length: 255 })
  email: string;

  @Column({ length: 255 })
  address: string;

  @Column({ length: 255 })
  tienSuBenh: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @Column()
  updatedUser: number;
}
