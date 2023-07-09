/**
 * Log lại các thao tác của người dùng trên hệ thống
 * Ví dụ: Tạo mới user, chỉnh sửa thông tin user
 */

import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ForgotPasswordModule } from '../auth/forgot-password/forgot-password.module';
import { NoteModule } from '../note/note.module';
import { SystemLogController } from './system-log.controller';
import { SystemLog } from './system-log.entity';
import { SystemLogService } from './system-log.service';


@Module({
    imports: [
        TypeOrmModule.forFeature([SystemLog]),
        NoteModule,
        ForgotPasswordModule
    ],
    providers: [SystemLogService],
    controllers: [SystemLogController],
    exports: [SystemLogService]
})
export class SystemLogModule { }
