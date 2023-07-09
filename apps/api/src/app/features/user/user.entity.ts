import { Entity, Column, PrimaryGeneratedColumn, BaseEntity, BeforeInsert, ManyToOne, JoinColumn, OneToMany, BeforeUpdate } from 'typeorm';
import { UserRoleEnum } from '@api-interfaces';
import { passwordService } from '../../common/services/password.service'
import { trimSpecialString } from '../../common/services/util.service';
import { UserDevice } from './user-device/user-device.entity';
import { UserRole } from './user-role/user-role.entity';

@Entity('user')
export class User extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(type => UserRole)
  @JoinColumn({ name: 'userRoleCode', referencedColumnName: 'code' })
  userRole: UserRole

  @Column({ length: 255, unique: true })
  username: string;

  @Column({ type: 'enum', enum: UserRoleEnum, default: UserRoleEnum.PATIENT })
  userRoleCode: UserRoleEnum;

  @Column({ type: 'varchar', nullable: false, select: false })
  password: string;

  @Column('datetime')
  createdAt: Date;

  @Column('datetime')
  updatedAt: Date;

  @Column()
  updatedUser: number;

  @OneToMany(() => UserDevice, device => device.user)
  devices: UserDevice[];

  @BeforeInsert() async hashPassword() {
    this.password = await passwordService.hashPassword(this.password);
    this.username = trimSpecialString(this.username)
  }

}
