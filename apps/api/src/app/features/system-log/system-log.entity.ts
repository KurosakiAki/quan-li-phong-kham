import { Entity, Column, PrimaryGeneratedColumn, BaseEntity, BeforeInsert, ManyToOne, JoinColumn, OneToMany, OneToOne } from 'typeorm';
import { ISystemLogChangeData, SystemLogObjectTypeEnum, SystemLogTypeEnum, UserRoleEnum } from '@api-interfaces';
import { User } from '../user/user.entity';
import { Note } from '../note/node.entity';


@Entity('systemLog')
export class SystemLog extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  /**
   * Name of log object: user, room ...
   */
  @Column({ length: 20, unique: true, type: String })
  objectType: SystemLogObjectTypeEnum;

  /**
   * Id of object in db
   */
  @Column()
  objectId: number;

  /**
   * Set to true for loggin of creating new object
   */
  @Column({
    type: 'enum',
    enum: SystemLogTypeEnum,
    default: SystemLogTypeEnum.UPDATE
  })
  type: SystemLogTypeEnum;

  /**
   * Change data for update action
   */
  @Column('simple-json')
  changeData: ISystemLogChangeData[];

  @Column('datetime')
  createdAt: Date;

  @Column()
  updatedUserId: number;

  @OneToOne(() => User)
  @JoinColumn()
  updatedUser: User;

  @OneToOne(() => Note)
  @JoinColumn()
  note:  Note;
}
