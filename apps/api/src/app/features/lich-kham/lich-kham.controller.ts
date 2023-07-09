import {
  BadRequestException,
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
import { CreateLichKhamDto, UpdateLichKhamDto } from './lich-kham.dto';
import { LichKhamService } from './lich-kham.service';
import { UserRoleEnum } from '@api-interfaces';

@ApiTags('api/lich-kham')
@Controller('api/lich-kham')
export class LichKhamController {
  constructor(private service: LichKhamService) {}

  @ApiOperation({ summary: 'Lấy danh sách lich-kham' })
  @Get()
  @Auth()
  async list(@Req() req, @Query('bacSiId') bacSiId?: number, @Query('khachHangId') khachHangId?: number) {
    return await this.service.list(bacSiId, khachHangId);
  }

  @ApiOperation({ summary: 'Lấy danh sách lich-kham by bac-si' })
  @Get('list-by-bac-si/:id')
  async listByBacSi(@Param() params, @Req() req) {
    return await this.service.listDangKyByBacSi(params.id);
  }

  @ApiOperation({ summary: 'Lấy thông tin chi tiết 1 lich-kham theo ID' })
  @Get(':id')
  @Auth()
  async get(@Param() params) {
    return await this.service.get(params.id);
  }

  @ApiOperation({ summary: 'Tạo mới lich-kham' })
  @ApiResponse({ status: 201, description: 'Dữ liệu lich-kham vừa tạo.' })
  @Post()
  async create(@Body() data: CreateLichKhamDto) {
    return await this.service.create(data);
  }

  @ApiOperation({ summary: 'Sửa thông tin lich-kham' })
  @ApiResponse({ status: 200, description: 'Dữ liệu lich-kham vừa sửa.' })
  @ApiBody({ type: UpdateLichKhamDto })
  @Put(':id')
  @Auth()
  async update(@Param() params, @Body() data: UpdateLichKhamDto, @Req() req) {
    return await this.service.update(params.id, data, req.user.id);
  }

  @ApiOperation({ summary: 'Xóa lich-kham theo ID' })
  @Delete(':id')
  @Auth(UserRoleEnum.ADMIN)
  async deleteLichKham(@Param() params, @Req() req) {
    return await this.service.remove(params.id, req.user.id);
  }

  @Post('confirm-lich-kham')
  async confirmLichKham(@Body() data: any) {
    const lichKham = await this.service.get(data.id);

    if (lichKham){
      return await this.service.confirmLichKham(lichKham);
    }

    throw new BadRequestException('Appointment does not exist');
  }
}
