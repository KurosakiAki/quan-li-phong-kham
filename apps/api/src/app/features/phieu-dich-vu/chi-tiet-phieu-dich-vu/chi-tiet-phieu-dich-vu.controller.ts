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
  CreateChiTietPhieuDichVuDto,
  UpdateChiTietPhieuDichVuDto,
} from './chi-tiet-phieu-dich-vu.dto';
import { ChiTietPhieuDichVuService } from './chi-tiet-phieu-dich-vu.service';

@ApiBearerAuth()
@ApiTags('api/chi-tiet-phieu-dich-vu')
@Controller('api/chi-tiet-phieu-dich-vu')
export class ChiTietPhieuDichVuController {
  constructor(private service: ChiTietPhieuDichVuService) {}

  @ApiOperation({ summary: 'Lấy danh sách chi-tiet-phieu-dich-vu' })
  @Get()
  @Auth()
  async list(@Req() req, @Query('phieuDichVuId') phieuDichVuId?: number) {
    return await this.service.list(phieuDichVuId);
  }

  @ApiOperation({ summary: 'Lấy danh sách chi-tiet-phieu-dich-vu by phieu-dich-vu-id' })
  @Get('list-by-phieu-dich-vu-id/:id')
  @Auth()
  async listByPhieuDichVuId(@Param() params) {
    return await this.service.listByPhieuDichVuId(params.id);
  }

  @ApiOperation({
    summary: 'Lấy thông tin chi tiết 1 chi-tiet-phieu-dich-vu theo ID',
  })
  @Get(':id')
  @Auth()
  async get(@Param() params) {
    return await this.service.get(params.id);
  }

  @ApiOperation({ summary: 'Tạo mới chi-tiet-phieu-dich-vu' })
  @ApiResponse({
    status: 201,
    description: 'Dữ liệu chi-tiet-phieu-dich-vu vừa tạo.',
  })
  @Post()
  @Auth()
  async create(@Body() data: CreateChiTietPhieuDichVuDto, @Req() req) {
    return await this.service.create(data, req.user.id);
  }

  @ApiOperation({ summary: 'Sửa thông tin chi-tiet-phieu-dich-vu' })
  @ApiResponse({
    status: 200,
    description: 'Dữ liệu chi-tiet-phieu-dich-vu vừa sửa.',
  })
  @ApiBody({ type: UpdateChiTietPhieuDichVuDto })
  @Put(':id')
  @Auth()
  async update(
    @Param() params,
    @Body() data: UpdateChiTietPhieuDichVuDto,
    @Req() req
  ) {
    return await this.service.update(params.id, data, req.user.id);
  }

  @ApiOperation({ summary: 'Xóa chi-tiet-phieu-dich-vu theo ID' })
  @Delete(':id')
  @Auth()
  async deleteUser(@Param() params, @Req() req) {
    return await this.service.remove(params.id, req.user.id);
  }
}
