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
import { Auth } from '../../auth/auth.decorator';
import {
  CreateChiTietThuocDto,
  UpdateChiTietThuocDto,
} from './chi-tiet-thuoc.dto';
import { ChiTietThuocService } from './chi-tiet-thuoc.service';

@ApiBearerAuth()
@ApiTags('api/chi-tiet-thuoc')
@Controller('api/chi-tiet-thuoc')
export class ChiTietThuocController {
  constructor(private service: ChiTietThuocService) {}

  @ApiOperation({ summary: 'Lấy danh sách chi-tiet-thuoc' })
  @Get()
  @Auth()
  async list(@Req() req) {
    return await this.service.list();
  }

  @ApiOperation({ summary: 'Lấy danh sách chi-tiet-thuoc by nhap-kho-id' })
  @Get('list-by-nhap-kho-id/:id')
  @Auth()
  async listByNhapKhoId(@Param() params) {
    return await this.service.listByNhapKhoId(params.id);
  }

  @ApiOperation({ summary: 'Lấy danh sách chi-tiet-thuoc by thuoc-id' })
  @Get('list-by-thuoc-id/:id')
  @Auth()
  async listByThuocId(@Param() params) {
    return await this.service.listByThuocId(params.id);
  }

  @ApiOperation({ summary: 'Lấy danh sách chi-tiet-thuoc by thuoc-id' })
  @Get('list-da-kiem-dinh/:id')
  @Auth()
  async listDaKiemDinhByThuocId(@Param() params) {
    return await this.service.listDaKiemDinhByThuocId(params.id);
  }

  @ApiOperation({ summary: 'Lấy thông tin chi tiết 1 chi-tiet-thuoc theo ID' })
  @Get(':id')
  @Auth()
  async get(@Param() params) {
    return await this.service.get(params.id);
  }

  @ApiOperation({ summary: 'Tạo mới chi-tiet-thuoc' })
  @ApiResponse({ status: 201, description: 'Dữ liệu chi-tiet-thuoc vừa tạo.' })
  @Post()
  @Auth()
  async create(@Body() data: CreateChiTietThuocDto, @Req() req) {
    return await this.service.create(data, req.user.id);
  }

  @ApiOperation({ summary: 'Sửa thông tin chi-tiet-thuoc' })
  @ApiResponse({ status: 200, description: 'Dữ liệu chi-tiet-thuoc vừa sửa.' })
  @ApiBody({ type: UpdateChiTietThuocDto })
  @Put(':id')
  @Auth()
  async update(
    @Param() params,
    @Body() data: UpdateChiTietThuocDto,
    @Req() req
  ) {
    return await this.service.update(params.id, data, req.user.id);
  }

  @ApiOperation({ summary: 'Xóa chi-tiet-thuoc theo ID' })
  @Delete(':id')
  @Auth()
  async deleteUser(@Param() params, @Req() req) {
    return await this.service.remove(params.id, req.user.id);
  }
}
