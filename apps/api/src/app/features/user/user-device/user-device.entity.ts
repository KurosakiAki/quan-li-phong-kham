import { Entity, Column, PrimaryGeneratedColumn, BaseEntity, ManyToOne, JoinColumn } from 'typeorm';
import { User } from '../user.entity';

@Entity('userDevice')
export class UserDevice extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 200, unique: true })
  deviceToken: string;

  @Column()      // Android, iOS...
  deviceType: string;

  @Column({ type: 'datetime' })
  createdAt: Date;

  @Column({ type: 'datetime' })
  updatedAt: Date;

  @Column()
  updatedUser: number;

  @Column()
  userId: number;

  @ManyToOne(() => User, user => user.devices)
  @JoinColumn()
  user: User;
}
