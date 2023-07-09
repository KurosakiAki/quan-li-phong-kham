import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
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
  CreateChiTietDonThuocDto,
  UpdateChiTietDonThuocDto,
} from './chi-tiet-don-thuoc.dto';
import { ChiTietDonThuocService } from './chi-tiet-don-thuoc.service';

@ApiBearerAuth()
@ApiTags('api/chi-tiet-don-thuoc')
@Controller('api/chi-tiet-don-thuoc')
export class ChiTietDonThuocController {
  constructor(private service: ChiTietDonThuocService) {}

  @ApiOperation({ summary: 'Lấy danh sách chi-tiet-don-thuoc' })
  @Get()
  @Auth()
  async list(@Req() req, @Query('donThuocId') donThuocId?: number) {
    return await this.service.list(donThuocId);
  }

  @ApiOperation({
    summary: 'Lấy thông tin chi tiết 1 chi-tiet-don-thuoc theo ID',
  })
  @Get(':id')
  @Auth()
  async get(@Param() params) {
    return await this.service.get(params.id);
  }

  @ApiOperation({ summary: 'Tạo mới chi-tiet-don-thuoc' })
  @ApiResponse({
    status: 201,
    description: 'Dữ liệu chi-tiet-don-thuoc vừa tạo.',
  })
  @Post()
  @Auth()
  async create(@Body() data: CreateChiTietDonThuocDto, @Req() req) {
    return await this.service.create(data, req.user.id);
  }

  @ApiOperation({ summary: 'Sửa thông tin chi-tiet-don-thuoc' })
  @ApiResponse({
    status: 200,
    description: 'Dữ liệu chi-tiet-don-thuoc vừa sửa.',
  })
  @ApiBody({ type: UpdateChiTietDonThuocDto })
  @Put(':id')
  @Auth()
  async update(
    @Param() params,
    @Body() data: UpdateChiTietDonThuocDto,
    @Req() req
  ) {
    return await this.service.update(params.id, data, req.user.id);
  }

  @ApiOperation({ summary: 'Lấy danh sách chi-tiet-don-thuoc by don-thuoc-id' })
  @Get('list-by-don-thuoc-id/:id')
  @Auth()
  async listByDonThuocId(@Param() params) {
    return await this.service.listByDonThuocId(params.id);
  }

  @ApiOperation({ summary: 'Xóa chi-tiet-don-thuoc theo ID' })
  @Delete(':id')
  @Auth()
  async deleteUser(@Param() params, @Req() req) {
    return await this.service.remove(params.id, req.user.id);
  }
}
