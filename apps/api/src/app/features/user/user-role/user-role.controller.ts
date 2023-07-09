import { Controller, Get, Param } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { Auth } from '../../auth/auth.decorator';
import { UserRoleService } from './user-role.service';

@ApiBearerAuth()
@ApiTags('api/user-role')
@Controller('api/user-role')
export class UserRoleController {
  constructor(private userRoleService: UserRoleService) { }

  @ApiOperation({ summary: 'Get all user' })
  @Get()
  @Auth()
  async list() {
    return await this.userRoleService.list();
  }

  @ApiOperation({ summary: 'Get user by id' })
  @Get(':id')
  @Auth()
  async get(@Param() params) {
    return await this.userRoleService.get(params.id);
  }
}
