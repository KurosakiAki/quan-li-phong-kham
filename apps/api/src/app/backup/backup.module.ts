import { Module } from '@nestjs/common';
import { AzureStorageModule } from '@nestjs/azure-storage';
import { configService } from '../../config/config.service'
import { BackupService } from './backup.service';

@Module({
  imports: [
    AzureStorageModule.withConfig({
      sasKey: configService.getValue('AZURE_STORAGE_SAS_KEY'),
      accountName: configService.getValue('AZURE_STORAGE_ACCOUNT'),
      containerName: configService.getValue('AZURE_BACKUP_CONTAINER'),
    }),
  ],
  providers: [BackupService],
  controllers: [],
  exports: [BackupService]
})
export class BackupModule { }
