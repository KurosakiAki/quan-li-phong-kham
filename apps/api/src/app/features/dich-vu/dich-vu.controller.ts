import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Req,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiBody,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { Auth } from '../auth/auth.decorator';
import { CreateDichVuDto, UpdateDichVuDto } from './dich-vu.dto';
import { DichVuService } from './dich-vu.service';
import { UserRoleEnum } from '@api-interfaces';

@ApiBearerAuth()
@ApiTags('api/dich-vu')
@Controller('api/dich-vu')
export class DichVuController {
  constructor(private service: DichVuService) {}

  @ApiOperation({ summary: 'Lấy danh sách dich-vu' })
  @Get()
  @Auth()
  async list(@Req() req) {
    return await this.service.list();
  }

  @ApiOperation({ summary: 'Lấy thông tin chi tiết 1 dich-vu theo ID' })
  @Get(':id')
  @Auth()
  async get(@Param() params) {
    return await this.service.get(params.id);
  }

  @ApiOperation({ summary: 'Tạo mới dich-vu' })
  @ApiResponse({ status: 201, description: 'Dữ liệu dich-vu vừa tạo.' })
  @Post()
  @Auth(UserRoleEnum.ADMIN)
  async create(@Body() data: CreateDichVuDto, @Req() req) {
    return await this.service.create(data, req.user.id);
  }

  @ApiOperation({ summary: 'Sửa thông tin dich-vu' })
  @ApiResponse({ status: 200, description: 'Dữ liệu dich-vu vừa sửa.' })
  @ApiBody({ type: UpdateDichVuDto })
  @Put(':id')
  @Auth(UserRoleEnum.ADMIN)
  async update(@Param() params, @Body() data: UpdateDichVuDto, @Req() req) {
    return await this.service.update(params.id, data, req.user.id);
  }

  @ApiOperation({ summary: 'Xóa dich-vu theo ID' })
  @Delete(':id')
  @Auth(UserRoleEnum.ADMIN)
  async deleteUser(@Param() params, @Req() req) {
    return await this.service.remove(params.id, req.user.id);
  }
}
