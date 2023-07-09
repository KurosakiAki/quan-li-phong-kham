import {
  Controller,
  Request,
  Post,
  Body,
  BadRequestException,
  Req,
  Get,
  UnauthorizedException,
  Param,
} from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags, ApiBody } from '@nestjs/swagger';

import { ChangePasswordDto, LoginDto } from './auth.dto';
import { Auth } from './auth.decorator';
import { AuthService } from './auth.service';
import { UserService } from '../user/user.service';
import { UserDeviceService } from '../user/user-device/user-device.service';
import { CreateUserDeviceDto } from '../user/user-device/user-device.dto';
import { request } from 'express';
import { ForgotPasswordDto } from './forgot-password/forgot-password.dto';
import { ForgotPasswordService } from './forgot-password/forgot-password.service';
import { KhachHangService } from '../khach-hang/khach-hang.service';
import { RegisterTokenService } from './registerToken/registerToken.service';

@ApiTags('api/auth')
@Controller('api/auth')
export class AuthController {
  constructor(
    private authService: AuthService,
    private userService: UserService,
    private deviceService: UserDeviceService,
    private forgotPassword: ForgotPasswordService,
    private registerTokenService: RegisterTokenService,
    private khachHangService: KhachHangService
  ) { }

  @ApiOperation({ summary: 'Login user' })
  @ApiResponse({
    status: 200,
    description: 'Json web token for logged in user',
  })
  @Post('login')
  async login(@Body() data: LoginDto) {
    const user = await this.authService.validateUser(data);

    if (user) {
      return this.authService.generateJWT(user);
    }
    throw new BadRequestException('Wrong username or password');
  }

  @ApiOperation({ summary: 'Get current logged in user' })
  @Auth()
  @Get('me')
  async me(@Request() req) {
    const user = await this.userService.getUser(req.user.id);
    if (!user) {
      throw new UnauthorizedException('User is not exist');
    }
    const { password, ...returnUser } = user;
    return returnUser;
  }

  @ApiOperation({ summary: 'Create user device info' })
  @ApiResponse({
    status: 200,
    description: 'The device info has been added successfully.',
  })
  @ApiBody({ type: CreateUserDeviceDto })
  @Post('device')
  @Auth()
  async createDevice(@Req() req, @Body() createDeviceDto: CreateUserDeviceDto) {
    console.log(createDeviceDto);
    return await this.deviceService.create(createDeviceDto, req.user);
  }

  @ApiOperation({ summary: 'Logout and remove user device token' })
  @ApiResponse({ status: 200 })
  @ApiBody({ type: CreateUserDeviceDto })
  @Post('logout')
  @Auth()
  async logout(@Req() req, @Body() createDeviceDto: CreateUserDeviceDto) {
    if (createDeviceDto.deviceToken) {
      const userDevice = await this.deviceService.getUserDeviceByToken(
        createDeviceDto.deviceToken,
      );
      if (userDevice.userId === req.user.id) {
        await this.deviceService.deleteUserDeviceByToken(
          createDeviceDto.deviceToken,
        );
      }
    }
    return true;
  }

  @ApiOperation({ summary: 'Change password for user' })
  @ApiBody({ type: ChangePasswordDto })
  @Post(':id/change-password')
  @Auth()
  async changePassword(@Param('id') userId, @Body() data: ChangePasswordDto) {
    return await this.userService.changePassword(userId, data);
  }

  @Post('forgot-password')
  async forgot(@Body() data: ForgotPasswordDto) {
    const user = await this.userService.getUserByUsername(data.username);

    if (data.role === 'PATIENT'){
      if (user && (user.userRoleCode === data.role)) {
        return await this.forgotPassword.forgotPassword(user);
      }
    }
    else {
      if (user && (user.userRoleCode !== 'PATIENT')) {
        return await this.forgotPassword.forgotPassword(user);
      }
    }

    throw new BadRequestException('Email does not exist');
  }

  @Post('verify-code')
  async verifyCode(@Body() data: any) {
    const user = await this.khachHangService.getByReferenceId(data.referenceId);
    
    if (user) {
      if (!user.userId){
        return await this.registerTokenService.registerToken(user);
      }
      throw new BadRequestException('An account is already registered with your code');
    }
    throw new BadRequestException('Code does not exist');
  }
}
