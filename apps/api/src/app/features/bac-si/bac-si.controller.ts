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
import { CreateBacSiDto, UpdateBacSiDto } from './bac-si.dto';
import { BacSiService } from './bac-si.service';
import { generateReferenceIdService } from '../../common/services/generate-reference-id.service';

@ApiBearerAuth()
@ApiTags('api/bac-si')
@Controller('api/bac-si')
export class BacSiController {
  constructor(private service: BacSiService) {}

  @ApiOperation({ summary: 'Lấy danh sách bac-si' })
  @Get()
  async list(@Req() req) {
    return await this.service.list();
  }

  @ApiOperation({ summary: 'Lấy thông tin chi tiết 1 bac-si theo ID' })
  @Get(':id')
  async get(@Param() params) {
    return await this.service.get(params.id);
  }

  @ApiOperation({ summary: 'Tạo mới bac-si' })
  @ApiResponse({ status: 201, description: 'Dữ liệu bac-si vừa tạo.' })
  @Post()
  @Auth()
  async create(@Body() data: CreateBacSiDto, @Req() req) {
    let check = true;
    let referenceId = await generateReferenceIdService.generateCode();
    while (check){
      if (await this.service.getByReferenceId('BS' + referenceId)){
        referenceId = await generateReferenceIdService.generateCode();
      }
      else check = false;
    }
    return await this.service.create(data, req.user.id, 'BS' + referenceId);
  }

  @ApiOperation({ summary: 'Sửa thông tin bac-si' })
  @ApiResponse({ status: 200, description: 'Dữ liệu bac-si vừa sửa.' })
  @ApiBody({ type: UpdateBacSiDto })
  @Put(':id')
  @Auth()
  async update(@Param() params, @Body() data: UpdateBacSiDto, @Req() req) {
    return await this.service.update(params.id, data, req.user.id);
  }

  @ApiOperation({ summary: 'Xóa bac-si theo ID' })
  @Delete(':id')
  @Auth()
  async deleteUser(@Param() params, @Req() req) {
    return await this.service.deleteUser(params.id);
  }
}
