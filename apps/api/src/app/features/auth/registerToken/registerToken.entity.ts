import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  BaseEntity,
  DeleteDateColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('registerToken')
export class RegisterToken extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  khachHangId: number;

  @Column()
  token: string;
}
