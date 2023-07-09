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
  CreateNhapKhoThuocDto,
  UpdateNhapKhoThuocDto,
} from './nhap-kho-thuoc.dto';
import { NhapKhoThuocService } from './nhap-kho-thuoc.service';
import { generateReferenceIdService } from '../../../common/services/generate-reference-id.service';

@ApiBearerAuth()
@ApiTags('api/nhap-kho-thuoc')
@Controller('api/nhap-kho-thuoc')
export class NhapKhoThuocController {
  constructor(private service: NhapKhoThuocService) {}

  @ApiOperation({ summary: 'Lấy danh sách nhap-kho-thuoc' })
  @Get()
  @Auth()
  async list(@Req() req) {
    return await this.service.list();
  }

  @ApiOperation({ summary: 'Lấy thông tin chi tiết 1 nhap-kho-thuoc theo ID' })
  @Get(':id')
  @Auth()
  async get(@Param() params) {
    return await this.service.get(params.id);
  }

  @ApiOperation({ summary: 'Tạo mới nhap-kho-thuoc' })
  @ApiResponse({ status: 201, description: 'Dữ liệu nhap-kho-thuoc vừa tạo.' })
  @Post()
  @Auth()
  async create(@Body() data: CreateNhapKhoThuocDto, @Req() req) {
    let check = true;
    let referenceId = await generateReferenceIdService.generateCode();
    while (check){
      if (await this.service.getByMaNhapKho('NK' + referenceId)){
        referenceId = await generateReferenceIdService.generateCode();
      }
      else check = false;
    }
    return await this.service.create(data, req.user.id, 'NK' + referenceId);
  }

  @ApiOperation({ summary: 'Sửa thông tin nhap-kho-thuoc' })
  @ApiResponse({ status: 200, description: 'Dữ liệu nhap-kho-thuoc vừa sửa.' })
  @ApiBody({ type: UpdateNhapKhoThuocDto })
  @Put(':id')
  @Auth()
  async update(
    @Param() params,
    @Body() data: UpdateNhapKhoThuocDto,
    @Req() req
  ) {
    return await this.service.update(params.id, data, req.user.id);
  }

  @ApiOperation({ summary: 'Xóa nhap-kho-thuoc theo ID' })
  @Delete(':id')
  @Auth()
  async deleteUser(@Param() params, @Req() req) {
    return await this.service.remove(params.id, req.user.id);
  }
}
