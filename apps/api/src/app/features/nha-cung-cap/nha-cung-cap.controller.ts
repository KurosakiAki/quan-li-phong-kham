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
import { CreateNhaCungCapDto, UpdateNhaCungCapDto } from './nha-cung-cap.dto';
import { NhaCungCapService } from './nha-cung-cap.service';

@ApiBearerAuth()
@ApiTags('api/nha-cung-cap')
@Controller('api/nha-cung-cap')
export class NhaCungCapController {
  constructor(private service: NhaCungCapService) {}

  @ApiOperation({ summary: 'Lấy danh sách nha-cung-cap' })
  @Get()
  @Auth()
  async list(@Req() req) {
    return await this.service.list();
  }

  @ApiOperation({ summary: 'Lấy thông tin chi tiết 1 nha-cung-cap theo ID' })
  @Get(':id')
  @Auth()
  async get(@Param() params) {
    return await this.service.get(params.id);
  }

  @ApiOperation({ summary: 'Tạo mới nha-cung-cap' })
  @ApiResponse({ status: 201, description: 'Dữ liệu nha-cung-cap vừa tạo.' })
  @Post()
  @Auth()
  async create(@Body() data: CreateNhaCungCapDto, @Req() req) {
    return await this.service.create(data, req.user.id);
  }

  @ApiOperation({ summary: 'Sửa thông tin nha-cung-cap' })
  @ApiResponse({ status: 200, description: 'Dữ liệu nha-cung-cap vừa sửa.' })
  @ApiBody({ type: UpdateNhaCungCapDto })
  @Put(':id')
  @Auth()
  async update(@Param() params, @Body() data: UpdateNhaCungCapDto, @Req() req) {
    return await this.service.update(params.id, data, req.user.id);
  }

  @ApiOperation({ summary: 'Xóa nha-cung-cap theo ID' })
  @Delete(':id')
  @Auth()
  async deleteUser(@Param() params, @Req() req) {
    return await this.service.remove(params.id, req.user.id);
  }
}
