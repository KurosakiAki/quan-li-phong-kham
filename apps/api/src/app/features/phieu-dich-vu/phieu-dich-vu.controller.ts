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
import { Auth } from '../auth/auth.decorator';
import {
  CreatePhieuDichVuDto,
  UpdatePhieuDichVuDto,
} from './phieu-dich-vu.dto';
import { PhieuDichVuService } from './phieu-dich-vu.service';
import { generateReferenceIdService } from '../../common/services/generate-reference-id.service';

@ApiBearerAuth()
@ApiTags('api/phieu-dich-vu')
@Controller('api/phieu-dich-vu')
export class PhieuDichVuController {
  constructor(private service: PhieuDichVuService) {}

  @ApiOperation({ summary: 'Lấy danh sách phieu-dich-vu' })
  @Get()
  @Auth()
  async list(@Req() req, @Query('lichKhamId') lichKhamId?: number) {
    return await this.service.list(lichKhamId);
  }

  @ApiOperation({ summary: 'Lấy thông tin chi tiết 1 don-thuoc theo ID' })
  @Get('ma-hoa-don')
  @Auth()
  async getByMaHoaDon(@Param() params) {
    return await this.service.getByMaHoaDon(params.ma);
  }

  @ApiOperation({ summary: 'Lấy thông tin chi tiết 1 phieu-dich-vu theo ID' })
  @Get(':id')
  @Auth()
  async get(@Param() params) {
    return await this.service.get(params.id);
  }

  @ApiOperation({ summary: 'Tạo mới phieu-dich-vu' })
  @ApiResponse({ status: 201, description: 'Dữ liệu phieu-dich-vu vừa tạo.' })
  @Post()
  @Auth()
  async create(@Body() data: CreatePhieuDichVuDto, @Req() req) {
    let check = true;
    let referenceId = await generateReferenceIdService.generateCode();
    while (check){
      if (await this.service.getByMaPhieuDichVu('PDV' + referenceId)){
        referenceId = await generateReferenceIdService.generateCode();
      }
      else check = false;
    }
    return await this.service.create(data, req.user.id, 'PDV' + referenceId);
  }

  @ApiOperation({ summary: 'Sửa thông tin phieu-dich-vu' })
  @ApiResponse({ status: 200, description: 'Dữ liệu phieu-dich-vu vừa sửa.' })
  @ApiBody({ type: UpdatePhieuDichVuDto })
  @Put(':id')
  @Auth()
  async update(
    @Param() params,
    @Body() data: UpdatePhieuDichVuDto,
    @Req() req
  ) {
    return await this.service.update(params.id, data, req.user.id);
  }

  @ApiOperation({ summary: 'Xóa phieu-dich-vu theo ID' })
  @Delete(':id')
  @Auth()
  async deleteUser(@Param() params, @Req() req) {
    return await this.service.remove(params.id, req.user.id);
  }
}
