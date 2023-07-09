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
import { CreateThuocDto, UpdateThuocDto } from './thuoc.dto';
import { ThuocService } from './thuoc.service';

@ApiBearerAuth()
@ApiTags('api/thuoc')
@Controller('api/thuoc')
export class ThuocController {
  constructor(private service: ThuocService) {}

  @ApiOperation({ summary: 'Lấy danh sách thuoc' })
  @Get()
  @Auth()
  async list(@Req() req) {
    return await this.service.list();
  }

  @ApiOperation({ summary: 'Lấy thông tin chi tiết 1 thuoc theo ID' })
  @Get(':id')
  @Auth()
  async get(@Param() params) {
    return await this.service.get(params.id);
  }

  @ApiOperation({ summary: 'Tạo mới thuoc' })
  @ApiResponse({ status: 201, description: 'Dữ liệu thuoc vừa tạo.' })
  @Post()
  @Auth()
  async create(@Body() data: CreateThuocDto, @Req() req) {
    return await this.service.create(data, req.user.id);
  }

  @ApiOperation({ summary: 'Sửa thông tin thuoc' })
  @ApiResponse({ status: 200, description: 'Dữ liệu thuoc vừa sửa.' })
  @ApiBody({ type: UpdateThuocDto })
  @Put(':id')
  @Auth()
  async update(@Param() params, @Body() data: UpdateThuocDto, @Req() req) {
    return await this.service.update(params.id, data, req.user.id);
  }

  @ApiOperation({ summary: 'Xóa thuoc theo ID' })
  @Delete(':id')
  @Auth()
  async deleteUser(@Param() params, @Req() req) {
    return await this.service.remove(params.id, req.user.id);
  }
}
