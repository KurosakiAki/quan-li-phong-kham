import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import {
  SystemLogObjectTypeEnum,
  SystemLogTypeEnum,
  UserRoleEnum,
} from '@api-interfaces';
import { passwordService } from '../../common/services/password.service';
import { ForgotPasswordService } from '../auth/forgot-password/forgot-password.service';

import {
  ChangePasswordDto,
  CreateUserDto,
  RegisterDto,
  ResetPasswordDto,
  UpdateUserDto,
} from './user.dto';
import { User } from './user.entity';
import { SystemLogService } from '../system-log/system-log.service';
import { Admin } from '../admin/admin.entity';
import { BacSi } from '../bac-si/bac-si.entity';
import { NhanVien } from '../nhan-vien/nhan-vien.entity';
import { KhachHang } from '../khach-hang/khach-hang.entity';
import { UserRole } from './user-role/user-role.entity';
import { RegisterTokenService } from '../auth/registerToken/registerToken.service';
import { KhachHangService } from '../khach-hang/khach-hang.service';
import { format } from 'date-fns';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User) private usersRepository: Repository<User>,
    private forgotPasswordService: ForgotPasswordService,
    private registerTokenService: RegisterTokenService,
    private khachHangService: KhachHangService,
    private systemLogService: SystemLogService
  ) {}

  async createAdminUser(data: { username: string; password: string }) {
    const newUser = await this.usersRepository.create({
      ...data,
      userRoleCode: UserRoleEnum.ADMIN,
    });
    return await newUser.save();
  }

  async createUser(user: CreateUserDto, currentUser: User) {
    try {
      const newuser = await this.usersRepository.create({
        ...user
      });

      return await newuser.save();
    } catch (err) {
      if (err.code == 'ER_DUP_ENTRY') {
        throw new BadRequestException('Tên đăng nhập đã tồn tại');
      } else {
        throw new BadRequestException('Có lỗi khi tạo mới người dùng');
      }
    }
  }

  async getUsers(currentUser: User) {
    // const users = await this.usersRepository.find({
    //   relations: ['userRole'],
    // });

    const users = await this.usersRepository.createQueryBuilder('user')
    .leftJoin(Admin, 'admin', 'admin.userId = user.id')
    .leftJoin(BacSi, 'bacSi', 'bacSi.userId = user.id')
    .leftJoin(NhanVien, 'nhanVien', 'nhanVien.userId = user.id')
    .leftJoin(KhachHang, 'khachHang', 'khachHang.userId = user.id')
    .innerJoin(UserRole, 'dmUserRole', 'dmUserRole.code = user.userRoleCode')
    .select([
      'user.id AS id',
      'user.username AS username',
      'user.userRoleCode AS userRoleCode',
      'user.password AS password',
      'COALESCE(bacSi.id, admin.id, nhanVien.id, khachHang.id) AS roleId',
      'COALESCE(bacSi.referenceId, admin.referenceId, nhanVien.referenceId, khachHang.referenceId) AS referenceId',
      'COALESCE(bacSi.phone, admin.phone, nhanVien.phone, khachHang.phone) AS phone',
      'COALESCE(bacSi.email, admin.email, nhanVien.email, khachHang.email) AS email',
      'COALESCE(bacSi.fullname, admin.fullname, nhanVien.fullname, khachHang.fullname) AS fullname',
      'COALESCE(bacSi.birthday, admin.birthday, nhanVien.birthday, khachHang.birthday) AS birthday',
      'COALESCE(bacSi.gender, admin.gender, nhanVien.gender, khachHang.gender) AS gender',
      'COALESCE(bacSi.address, admin.address, nhanVien.address, khachHang.address) AS address',
      'bacSi.specialistId AS specialistId',
      'dmUserRole.name AS userRoleName'
    ])
    .getRawMany();

    return users;
  }

  async getUser(id: number): Promise<User> {
    return await this.usersRepository.createQueryBuilder('user')
    .leftJoin(Admin, 'admin', 'admin.userId = user.id')
    .leftJoin(BacSi, 'bacSi', 'bacSi.userId = user.id')
    .leftJoin(NhanVien, 'nhanVien', 'nhanVien.userId = user.id')
    .leftJoin(KhachHang, 'khachHang', 'khachHang.userId = user.id')
    .select([
      'user.id AS id',
      'user.username AS username',
      'user.userRoleCode AS userRoleCode',
      'user.password AS password',
      'COALESCE(bacSi.id, admin.id, nhanVien.id, khachHang.id) AS roleId',
      'COALESCE(bacSi.referenceId, admin.referenceId, nhanVien.referenceId, khachHang.referenceId) AS referenceId',
      'COALESCE(bacSi.phone, admin.phone, nhanVien.phone, khachHang.phone) AS phone',
      'COALESCE(bacSi.email, admin.email, nhanVien.email, khachHang.email) AS email',
      'COALESCE(bacSi.fullname, admin.fullname, nhanVien.fullname, khachHang.fullname) AS fullname',
      'COALESCE(bacSi.birthday, admin.birthday, nhanVien.birthday, khachHang.birthday) AS birthday',
      'COALESCE(bacSi.gender, admin.gender, nhanVien.gender, khachHang.gender) AS gender',
      'COALESCE(bacSi.address, admin.address, nhanVien.address, khachHang.address) AS address',
      'bacSi.specialistId AS specialistId',
    ])
    .where('user.id = :id', { id })
    .getRawOne();
  }

  async getUserName(id: number): Promise<User> {
    return await this.usersRepository.createQueryBuilder('user')
    .leftJoin(Admin, 'admin', 'admin.userId = user.id')
    .leftJoin(BacSi, 'bacSi', 'bacSi.userId = user.id')
    .leftJoin(NhanVien, 'nhanVien', 'nhanVien.userId = user.id')
    .leftJoin(KhachHang, 'khachHang', 'khachHang.userId = user.id')
    .select([
      'user.id AS id',
      'COALESCE(bacSi.fullname, admin.fullname, nhanVien.fullname, khachHang.fullname) AS fullname',
    ])
    .where('user.id = :id', { id })
    .getRawOne();
  }

  async getUserByUsername(username: string): Promise<any> {
    return await this.usersRepository.createQueryBuilder('user')
      .leftJoin(Admin, 'admin', 'admin.userId = user.id')
      .leftJoin(BacSi, 'bacSi', 'bacSi.userId = user.id')
      .leftJoin(NhanVien, 'nhanVien', 'nhanVien.userId = user.id')
      .leftJoin(KhachHang, 'khachHang', 'khachHang.userId = user.id')
      .select([
        'user.id AS id',
        'user.username AS username',
        'user.password AS password',
        'user.userRoleCode AS userRoleCode',
        'COALESCE(bacSi.email, admin.email, nhanVien.email, khachHang.email) AS email',
        'COALESCE(bacSi.phone, admin.phone, nhanVien.phone, khachHang.phone) AS phone',
      ])
      .where('username = :username', { username })
      .getRawOne();

    // return await this.usersRepository.findOne({ username: username });
  }

  async updateUser(id: number, user: UpdateUserDto, userId: number) {
    try {
      const beforeUpdateUser = await this.usersRepository.findOne({ where: { id } });
      await this.usersRepository.update(id, {
        ...user,
        updatedAt: new Date(),
        updatedUser: userId,
      });
      const afterUpdateUser = await this.usersRepository.findOne({ where: { id } });

      this.systemLogService.logChange({
        before: beforeUpdateUser,
        after: afterUpdateUser,
        objectId: afterUpdateUser.id,
        objectType: SystemLogObjectTypeEnum.USER,
        type: SystemLogTypeEnum.UPDATE,
        updatedUserId: userId,
      });

      return afterUpdateUser;
    } catch (error) {
      console.log(error);
      throw error;
    }
  }

  async changePassword(userId: number, data: ChangePasswordDto) {
    return await this.usersRepository.update(userId, {
      password: await passwordService.hashPassword(data.password),
    });
  }

  async deleteUser(id: number) {
    return await this.usersRepository.delete(id);
  }

  async resetPassword(data: ResetPasswordDto) {
    const forgotPassword = await this.forgotPasswordService.getToken(
      data.token
    );
    if (forgotPassword && forgotPassword.userId && forgotPassword.token) {
      await this.usersRepository.update(forgotPassword.userId, {
        password: await passwordService.hashPassword(data.password),
      });

      await this.forgotPasswordService.removeToken(data.token);

      return true;
    }

    throw new BadRequestException('Token does not exist');
  }

  async register(data: RegisterDto) {
    const registerToken = await this.registerTokenService.getToken(
      data.token
    );
    if (registerToken && registerToken.khachHangId && registerToken.token) {
      try {
        const newuser = await this.usersRepository.create({
          ...data
        });
  
        const user = await newuser.save();

        const khachHang = await this.khachHangService.get(registerToken.khachHangId);

        await this.khachHangService.update(registerToken.khachHangId, {
          ...khachHang,
          birthday: format(khachHang.birthday, 'yyyy-MM-dd'),
          userId: user.id
        }, 0)

      } catch (err) {
        if (err.code == 'ER_DUP_ENTRY') {
          throw new BadRequestException('Tên đăng nhập đã tồn tại');
        } else {
          throw new BadRequestException('Có lỗi khi tạo mới người dùng');
        }
      }

      await this.registerTokenService.removeToken(data.token);

      return true;
    }

    throw new BadRequestException('Token does not exist');
  }
}
