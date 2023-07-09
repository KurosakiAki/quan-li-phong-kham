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
  ManyToOne,
} from 'typeorm';
import { User } from '../user/user.entity';
import { ChuyenKhoa } from '../chuyen-khoa/chuyen-khoa.entity';

@Entity('bacSi')
export class BacSi extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  userId: number;

  @Column({ length: 20 })
  referenceId: string;

  @Column()
  specialistId: number;

  @OneToOne(type => User)
  @JoinColumn()
  user: User;

  @ManyToOne(type => ChuyenKhoa)
  @JoinColumn()
  specialist: ChuyenKhoa;

  @Column({ length: 255 })
  fullname: string;

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

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @Column()
  updatedUser: number;
}
