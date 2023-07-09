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
import { CreateChuyenKhoaDto, UpdateChuyenKhoaDto } from './chuyen-khoa.dto';
import { ChuyenKhoaService } from './chuyen-khoa.service';
import { UserRoleEnum } from '@api-interfaces';

@ApiBearerAuth()
@ApiTags('api/chuyen-khoa')
@Controller('api/chuyen-khoa')
export class ChuyenKhoaController {
  constructor(private service: ChuyenKhoaService) {}

  @ApiOperation({ summary: 'Lấy danh sách chuyen-khoa' })
  @Get()
  async list(@Req() req) {
    return await this.service.list();
  }

  @ApiOperation({ summary: 'Lấy thông tin chi tiết 1 chuyen-khoa theo ID' })
  @Get(':id')
  async get(@Param() params) {
    return await this.service.get(params.id);
  }

  @ApiOperation({ summary: 'Tạo mới chuyen-khoa' })
  @ApiResponse({ status: 201, description: 'Dữ liệu chuyen-khoa vừa tạo.' })
  @Post()
  @Auth(UserRoleEnum.ADMIN)
  async create(@Body() data: CreateChuyenKhoaDto, @Req() req) {
    return await this.service.create(data, req.user.id);
  }

  @ApiOperation({ summary: 'Sửa thông tin chuyen-khoa' })
  @ApiResponse({ status: 200, description: 'Dữ liệu chuyen-khoa vừa sửa.' })
  @ApiBody({ type: UpdateChuyenKhoaDto })
  @Put(':id')
  @Auth(UserRoleEnum.ADMIN)
  async update(@Param() params, @Body() data: UpdateChuyenKhoaDto, @Req() req) {
    return await this.service.update(params.id, data, req.user.id);
  }

  @ApiOperation({ summary: 'Xóa chuyen-khoa theo ID' })
  @Delete(':id')
  @Auth(UserRoleEnum.ADMIN)
  async deleteUser(@Param() params, @Req() req) {
    return await this.service.remove(params.id, req.user.id);
  }
}
