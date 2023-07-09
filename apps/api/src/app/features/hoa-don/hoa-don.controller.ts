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
import { CreateHoaDonDto, UpdateHoaDonDto } from './hoa-don.dto';
import { HoaDonService } from './hoa-don.service';
import { generateReferenceIdService } from '../../common/services/generate-reference-id.service';

@ApiBearerAuth()
@ApiTags('api/hoa-don')
@Controller('api/hoa-don')
export class HoaDonController {
  constructor(private service: HoaDonService) {}

  @ApiOperation({ summary: 'Lấy danh sách hoa-don' })
  @Get()
  @Auth()
  async list(@Req() req, @Query('khachHangId') khachHangId?: number) {
    return await this.service.list(khachHangId);
  }

  @ApiOperation({ summary: 'Lấy thông tin chi tiết 1 hoa-don theo ID' })
  @Get(':id')
  @Auth()
  async get(@Param() params) {
    return await this.service.get(params.id);
  }

  @ApiOperation({ summary: 'Tạo mới hoa-don' })
  @ApiResponse({ status: 201, description: 'Dữ liệu hoa-don vừa tạo.' })
  @Post()
  @Auth()
  async create(@Body() data: CreateHoaDonDto, @Req() req) {
    let check = true;
    let referenceId = await generateReferenceIdService.generateCode();
    while (check){
      if (await this.service.getByMaHoaDon('HD' + referenceId)){
        referenceId = await generateReferenceIdService.generateCode();
      }
      else check = false;
    }
    return await this.service.create(data, req.user.id, 'HD' + referenceId);
  }

  @ApiOperation({ summary: 'Sửa thông tin hoa-don' })
  @ApiResponse({ status: 200, description: 'Dữ liệu hoa-don vừa sửa.' })
  @ApiBody({ type: UpdateHoaDonDto })
  @Put(':id')
  @Auth()
  async update(@Param() params, @Body() data: UpdateHoaDonDto, @Req() req) {
    return await this.service.update(params.id, data, req.user.id);
  }

  @ApiOperation({ summary: 'Xóa hoa-don theo ID' })
  @Delete(':id')
  @Auth()
  async deleteUser(@Param() params, @Req() req) {
    return await this.service.remove(params.id, req.user.id);
  }
}
