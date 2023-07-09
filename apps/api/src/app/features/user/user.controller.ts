import { Body, Controller, Delete, Get, Param, Post, Put, Req } from '@nestjs/common';
import { UserService } from './user.service'
import { ChangePasswordDto, CreateUserDto, RegisterDto, ResetPasswordDto, UpdateUserDto } from './user.dto'
import {
  ApiTags,
  ApiBearerAuth,
  ApiResponse,
  ApiOperation,
  ApiBody,
} from '@nestjs/swagger';
import { Auth } from '../auth/auth.decorator';
import { UserRoleEnum } from '@api-interfaces';


@ApiBearerAuth()
@ApiTags('api/user')
@Controller('api/user')
export class UserController {
  constructor(private service: UserService) { }

  @Get()
  @Auth(UserRoleEnum.ADMIN)
  async list(@Req() req) {
    return await this.service.getUsers(req.user);
  }

  @Get('name/:id')
  @Auth()
  async getName(@Param() params) {
    return await this.service.getUserName(params.id);
  }

  @Get(':id')
  @Auth(UserRoleEnum.ADMIN)
  async get(@Param() params) {
    return await this.service.getUser(params.id);
  }

  @ApiOperation({ summary: 'Create user' })
  @ApiResponse({ status: 201, description: 'Return user.' })
  @Post()
  @Auth(UserRoleEnum.ADMIN)
  async create(@Body() user: CreateUserDto, @Req() req) {
    return await this.service.createUser(user, req.user);
  }

  @ApiOperation({ summary: 'Update user' })
  @ApiResponse({ status: 200, description: 'Return user.' })
  @ApiBody({ type: UpdateUserDto })
  @Put(':id')
  @Auth(UserRoleEnum.ADMIN)
  async update(@Param() params, @Body() user: UpdateUserDto, @Req() req) {
    return await this.service.updateUser(params.id, user, req.user.id);
  }

  @ApiOperation({ summary: 'Update profile' })
  @ApiBody({ type: UpdateUserDto })
  @Post('update-profile')
  @Auth()
  async updateProfile(@Body() user: UpdateUserDto, @Req() req) {
    return await this.service.updateUser(req.user.id, user, req.user.id);
  }

  @ApiOperation({ summary: 'Change password for user' })
  @ApiBody({ type: ChangePasswordDto })
  @Post(':id/change-password')
  @Auth(UserRoleEnum.ADMIN)
  async changePassword(@Param('id') userId, @Body() data: ChangePasswordDto) {
    return await this.service.changePassword(userId, data);
  }

  @ApiOperation({ summary: 'Change password for user' })
  @ApiBody({ type: ChangePasswordDto })
  @Post('change-my-password')
  @Auth()
  async changeMyPassword(@Req() req, @Body() data: ChangePasswordDto) {
    return await this.service.changePassword(req.user.id, data);
  }

  @Delete(':id')
  @Auth(UserRoleEnum.ADMIN)
  async deleteUser(@Param() params) {
    return await this.service.deleteUser(params.id);
  }


  @ApiOperation({ summary: 'Reset password for user' })
  @Post('reset-my-password')
  async resetMyPassword(@Body() data: ResetPasswordDto) {
    return await this.service.resetPassword(data);
  }

  @ApiOperation({ summary: 'register user' })
  @Post('register')
  async register(@Body() data: RegisterDto) {
    return await this.service.register(data);
  }
}

