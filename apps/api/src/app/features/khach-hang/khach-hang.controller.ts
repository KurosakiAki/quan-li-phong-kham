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
import { CreateKhachHangDto, UpdateKhachHangDto } from './khach-hang.dto';
import { KhachHangService } from './khach-hang.service';
import { generateReferenceIdService } from '../../common/services/generate-reference-id.service'

@ApiBearerAuth()
@ApiTags('api/khach-hang')
@Controller('api/khach-hang')
export class KhachHangController {
  constructor(private service: KhachHangService) {}

  @ApiOperation({ summary: 'Lấy danh sách khach-hang' })
  @Get()
  @Auth()
  async list(@Req() req) {
    return await this.service.list();
  }

  @ApiOperation({ summary: 'Lấy thông tin chi tiết 1 khach-hang theo ID' })
  @Get(':id')
  @Auth()
  async get(@Param() params) {
    return await this.service.get(params.id);
  }

  @ApiOperation({ summary: 'Tạo mới khach-hang' })
  @ApiResponse({ status: 201, description: 'Dữ liệu khach-hang vừa tạo.' })
  @Post()
  @Auth()
  async create(@Body() data: CreateKhachHangDto, @Req() req) {
    let check = true;
    let referenceId = await generateReferenceIdService.generateCode();
    while (check){
      if (await this.service.getByReferenceId('BN' + referenceId)){
        referenceId = await generateReferenceIdService.generateCode();
      }
      else check = false;
    }
    return await this.service.create(data, req.user.id, 'BN' + referenceId);
  }

  @ApiOperation({ summary: 'Sửa thông tin khach-hang' })
  @ApiResponse({ status: 200, description: 'Dữ liệu khach-hang vừa sửa.' })
  @ApiBody({ type: UpdateKhachHangDto })
  @Put(':id')
  @Auth()
  async update(@Param() params, @Body() data: UpdateKhachHangDto, @Req() req) {
    return await this.service.update(params.id, data, req.user.id);
  }

  @ApiOperation({ summary: 'Xóa khach-hang theo ID' })
  @Delete(':id')
  @Auth()
  async deleteUser(@Param() params, @Req() req) {
    return await this.service.deleteUser(params.id);
  }
}
