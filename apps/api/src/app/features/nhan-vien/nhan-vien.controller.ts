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
import { CreateNhanVienDto, UpdateNhanVienDto } from './nhan-vien.dto';
import { NhanVienService } from './nhan-vien.service';
import { generateReferenceIdService } from '../../common/services/generate-reference-id.service';

@ApiBearerAuth()
@ApiTags('api/nhan-vien')
@Controller('api/nhan-vien')
export class NhanVienController {
  constructor(private service: NhanVienService) {}

  @ApiOperation({ summary: 'Lấy danh sách nhan-vien' })
  @Get()
  @Auth()
  async list(@Req() req) {
    return await this.service.list();
  }

  @ApiOperation({ summary: 'Lấy thông tin chi tiết 1 nhan-vien theo ID' })
  @Get(':id')
  @Auth()
  async get(@Param() params) {
    return await this.service.get(params.id);
  }

  @ApiOperation({ summary: 'Tạo mới nhan-vien' })
  @ApiResponse({ status: 201, description: 'Dữ liệu nhan-vien vừa tạo.' })
  @Post()
  @Auth()
  async create(@Body() data: CreateNhanVienDto, @Req() req) {
    let check = true;
    let referenceId = await generateReferenceIdService.generateCode();
    while (check){
      if (await this.service.getByReferenceId('NV' + referenceId)){
        referenceId = await generateReferenceIdService.generateCode();
      }
      else check = false;
    }
    return await this.service.create(data, req.user.id, 'NV' + referenceId);
  }

  @ApiOperation({ summary: 'Sửa thông tin nhan-vien' })
  @ApiResponse({ status: 200, description: 'Dữ liệu nhan-vien vừa sửa.' })
  @ApiBody({ type: UpdateNhanVienDto })
  @Put(':id')
  @Auth()
  async update(@Param() params, @Body() data: UpdateNhanVienDto, @Req() req) {
    return await this.service.update(params.id, data, req.user.id);
  }

  @ApiOperation({ summary: 'Xóa nhan-vien theo ID' })
  @Delete(':id')
  @Auth()
  async deleteUser(@Param() params, @Req() req) {
    return await this.service.deleteUser(params.id);
  }
}
