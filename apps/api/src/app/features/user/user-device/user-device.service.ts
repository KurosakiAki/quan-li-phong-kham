import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';

import { AuthUser } from '../../auth/auth-user.class';

import { UserDevice } from './user-device.entity';
import { CreateUserDeviceDto } from './user-device.dto';

@Injectable()
export class UserDeviceService {
  constructor(
    @InjectRepository(UserDevice) private repo: Repository<UserDevice>,
  ) {}

  async save(device: UserDevice): Promise<UserDevice> {
    return await this.repo.save(device);
  }

  async create(
    deviceDto: CreateUserDeviceDto,
    currentUser: AuthUser,
  ): Promise<UserDevice> {
    let device = await this.repo.findOne(
      {
        where: { deviceToken: deviceDto.deviceToken },
        relations: ['user']
      }
    );

    if (device && !device.user) {
      // Có thể user của device này đã bị xóa, mình xóa luôn device đi
      await this.repo.remove(device);
      device = null;
    }

    if (device) {
      // If device token already exists in DB, we will update userId for that device token
      if (currentUser.id && device.user.id !== currentUser.id) {
        device.user.id = currentUser.id;
      }

      if (deviceDto.deviceType) {
        device.deviceType = deviceDto.deviceType;
      }

      device.updatedAt = new Date();
      device.updatedUser = currentUser.id;

      return await this.save(device);
    } else {
      // Or create new one
      const newDevice = await this.repo.create({
        ...deviceDto,
        user: {
          id: currentUser.id,
        },
        updatedUser: currentUser.id,
      });

      return await newDevice.save();
    }
  }

  /**
   * Get devices of many users
   * @param ids
   */
  async getDevicesOfUsers(ids: number[]): Promise<UserDevice[]> {
    return this.repo.find({ where: { userId: In(ids) } });
  }

  async deleteUserDevice(userDevice: UserDevice) {
    return this.repo.remove(userDevice);
  }

  async getUserDeviceByToken(deviceToken: string) {
    return this.repo.findOne({ where: { deviceToken } });
  }

  async deleteUserDeviceByToken(deviceToken: string) {
    return this.repo
      .createQueryBuilder()
      .delete()
      .where('deviceToken = :deviceToken', { deviceToken })
      .execute();
  }
}
