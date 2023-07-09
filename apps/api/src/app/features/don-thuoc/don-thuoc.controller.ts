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
import { CreateDonThuocDto, UpdateDonThuocDto } from './don-thuoc.dto';
import { DonThuocService } from './don-thuoc.service';
import { generateReferenceIdService } from '../../common/services/generate-reference-id.service';

@ApiBearerAuth()
@ApiTags('api/don-thuoc')
@Controller('api/don-thuoc')
export class DonThuocController {
  constructor(private service: DonThuocService) {}

  @ApiOperation({ summary: 'Lấy danh sách don-thuoc' })
  @Get()
  @Auth()
  async list(@Req() req) {
    return await this.service.list();
  }

  @ApiOperation({ summary: 'Lấy thông tin chi tiết 1 don-thuoc theo ID' })
  @Get('ma-hoa-don')
  @Auth()
  async getByMaHoaDon(@Query('maHoaDon') maHoaDon: string) {
    return await this.service.getByMaHoaDon(maHoaDon);
  }

  @ApiOperation({ summary: 'Lấy thông tin chi tiết 1 don-thuoc theo ID' })
  @Get(':id')
  @Auth()
  async get(@Param() params) {
    return await this.service.get(params.id);
  }

  @ApiOperation({ summary: 'Lấy thông tin chi tiết 1 don-thuoc theo ID' })
  @Get('lich-kham/:id')
  @Auth()
  async getByLichKhamId(@Param() params) {
    return await this.service.getByLichKhamId(params.id);
  }

  @ApiOperation({ summary: 'Tạo mới don-thuoc' })
  @ApiResponse({ status: 201, description: 'Dữ liệu don-thuoc vừa tạo.' })
  @Post()
  @Auth()
  async create(@Body() data: CreateDonThuocDto, @Req() req) {
    let check = true;
    let referenceId = await generateReferenceIdService.generateCode();
    while (check){
      if (await this.service.getByMaDonThuoc('DT' + referenceId)){
        referenceId = await generateReferenceIdService.generateCode();
      }
      else check = false;
    }
    return await this.service.create(data, req.user.id, 'DT' + referenceId);
  }

  @ApiOperation({ summary: 'Sửa thông tin don-thuoc' })
  @ApiResponse({ status: 200, description: 'Dữ liệu don-thuoc vừa sửa.' })
  @ApiBody({ type: UpdateDonThuocDto })
  @Put(':id')
  @Auth()
  async update(@Param() params, @Body() data: UpdateDonThuocDto, @Req() req) {
    return await this.service.update(params.id, data, req.user.id);
  }

  @ApiOperation({ summary: 'Xóa don-thuoc theo ID' })
  @Delete(':id')
  @Auth()
  async deleteUser(@Param() params, @Req() req) {
    return await this.service.remove(params.id, req.user.id);
  }
}
