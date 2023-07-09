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
import { CreateAdminDto, UpdateAdminDto } from './admin.dto';
import { AdminService } from './admin.service';
import { generateReferenceIdService } from '../../common/services/generate-reference-id.service';

@ApiBearerAuth()
@ApiTags('api/admin')
@Controller('api/admin')
export class AdminController {
  constructor(private service: AdminService) {}

  @ApiOperation({ summary: 'Lấy danh sách admin' })
  @Get()
  @Auth()
  async list(@Req() req) {
    return await this.service.list();
  }

  @ApiOperation({ summary: 'Lấy thông tin chi tiết 1 admin theo ID' })
  @Get(':id')
  @Auth()
  async get(@Param() params) {
    return await this.service.get(params.id);
  }

  @ApiOperation({ summary: 'Tạo mới admin' })
  @ApiResponse({ status: 201, description: 'Dữ liệu admin vừa tạo.' })
  @Post()
  @Auth()
  async create(@Body() data: CreateAdminDto, @Req() req) {
    let check = true;
    let referenceId = await generateReferenceIdService.generateCode();
    while (check){
      if (await this.service.getByReferenceId('AD' + referenceId)){
        referenceId = await generateReferenceIdService.generateCode();
      }
      else check = false;
    }
    return await this.service.create(data, req.user.id, 'AD' + referenceId);
  }

  @ApiOperation({ summary: 'Sửa thông tin admin' })
  @ApiResponse({ status: 200, description: 'Dữ liệu admin vừa sửa.' })
  @ApiBody({ type: UpdateAdminDto })
  @Put(':id')
  @Auth()
  async update(@Param() params, @Body() data: UpdateAdminDto, @Req() req) {
    return await this.service.update(params.id, data, req.user.id);
  }

  @ApiOperation({ summary: 'Xóa admin theo ID' })
  @Delete(':id')
  @Auth()
  async deleteUser(@Param() params, @Req() req) {
    return await this.service.deleteUser(params.id);
  }
}
