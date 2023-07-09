import { Body, Controller, Delete, Get, Param, Post, Put, Req } from '@nestjs/common';

import {
    ApiTags,
    ApiBearerAuth,
    ApiResponse,
    ApiOperation,
    ApiBody,
} from '@nestjs/swagger';
import { SystemLogDto } from './system-log.dto';

import { SystemLogService } from './system-log.service';


@ApiBearerAuth()
@ApiTags('api/system-log')
@Controller('api/system-log')
export class SystemLogController {
    constructor(private service: SystemLogService) { }

    @ApiOperation({
        summary: 'Get log of an object'
    })
    @ApiResponse({ type: [SystemLogDto] })
    @Get(':objectType/:objectId')
    async list(@Req() req) {
        /**
         * Có thể thêm code để kiểm tra quyền của người dùng với mỗi objectType và objectId ở đây
         * Nếu không thì ai cũng có thể xem log
         */
        return await this.service.listByObject({ objectType: req.params.objectType, objectId: req.params.objectId });
    }
}