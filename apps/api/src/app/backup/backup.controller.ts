import { Controller, Get } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { BackupService } from './backup.service';

@ApiBearerAuth()
@ApiTags('api/backup')
@Controller('api/backup')
export class BackupController {
  constructor(private backupService: BackupService) { }

  @ApiOperation({ summary: 'Backup database' })
  @Get()
  async backup() {
    return await this.backupService.backupDatabase()
  }
}
