import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserRole } from './user-role.entity';

@Injectable()
export class UserRoleService {
  constructor(@InjectRepository(UserRole) private userRoleRepository: Repository<UserRole>) { }

  async list(): Promise<UserRole[]> {
    return await this.userRoleRepository.find();
  }

  async get(id: number): Promise<UserRole> {
    return await this.userRoleRepository.findOne({ where: { id } });
  }
}
