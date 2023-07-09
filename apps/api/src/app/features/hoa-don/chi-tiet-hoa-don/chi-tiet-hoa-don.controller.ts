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
  CreateChiTietHoaDonDto,
  UpdateChiTietHoaDonDto,
} from './chi-tiet-hoa-don.dto';
import { ChiTietHoaDonService } from './chi-tiet-hoa-don.service';

@ApiBearerAuth()
@ApiTags('api/chi-tiet-hoa-don')
@Controller('api/chi-tiet-hoa-don')
export class ChiTietHoaDonController {
  constructor(private service: ChiTietHoaDonService) {}

  @ApiOperation({ summary: 'Lấy danh sách chi-tiet-hoa-don' })
  @Get()
  @Auth()
  async list(@Req() req) {
    return await this.service.list();
  }

  @ApiOperation({ summary: 'Lấy danh sách chi-tiet-hoa-don by hoa-don-id' })
  @Get('list-by-hoa-don-id/:id')
  @Auth()
  async listByHoaDonId(@Param() params) {
    return await this.service.listByHoaDonId(params.id);
  }

  @ApiOperation({
    summary: 'Lấy thông tin chi tiết 1 chi-tiet-hoa-don theo ID',
  })
  @Get(':id')
  @Auth()
  async get(@Param() params) {
    return await this.service.get(params.id);
  }

  @ApiOperation({ summary: 'Tạo mới chi-tiet-hoa-don' })
  @ApiResponse({
    status: 201,
    description: 'Dữ liệu chi-tiet-hoa-don vừa tạo.',
  })
  @Post()
  @Auth()
  async create(@Body() data: CreateChiTietHoaDonDto, @Req() req) {
    return await this.service.create(data, req.user.id);
  }

  @ApiOperation({ summary: 'Sửa thông tin chi-tiet-hoa-don' })
  @ApiResponse({
    status: 200,
    description: 'Dữ liệu chi-tiet-hoa-don vừa sửa.',
  })
  @ApiBody({ type: UpdateChiTietHoaDonDto })
  @Put(':id')
  @Auth()
  async update(
    @Param() params,
    @Body() data: UpdateChiTietHoaDonDto,
    @Req() req
  ) {
    return await this.service.update(params.id, data, req.user.id);
  }

  @ApiOperation({ summary: 'Xóa chi-tiet-hoa-don theo ID' })
  @Delete(':id')
  @Auth()
  async deleteUser(@Param() params, @Req() req) {
    return await this.service.remove(params.id, req.user.id);
  }
}
