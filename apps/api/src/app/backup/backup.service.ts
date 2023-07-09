import { AzureStorageOptions, AzureStorageService, AZURE_STORAGE_MODULE_OPTIONS, UploadedFileMetadata } from '@nestjs/azure-storage';
import { Inject, Injectable } from '@nestjs/common';
import { IUploadedFileMetadataExtra } from './IUploadedFileMetadataExtra.interface';
import mysqldump from 'mysqldump';
import { join } from 'path';
import * as fs from 'fs';
import { configService } from '../../config/config.service';

@Injectable()
export class BackupService {
  constructor(
    private readonly azureStorage: AzureStorageService,
    @Inject(AZURE_STORAGE_MODULE_OPTIONS) private readonly azureOptions: AzureStorageOptions,
  ) { }

  /**
   * Upload backup file to azure
   * @param file
   * @returns
   */
  async uploadBackup(file: UploadedFileMetadata): Promise<IUploadedFileMetadataExtra> {
    const uploadfile = {
      ...file,
      buffer: file.buffer,
      originalname: file.originalname,
    };

    let storageUrl = await this.azureStorage.upload(uploadfile);
    storageUrl = storageUrl.slice(0, storageUrl.indexOf('?sv=')).replace('%2F', '/');

    return { ...file, url: storageUrl };
  }

  async backupDatabase() {
    const backupFileName = 'dump.sql.gz'

    await mysqldump({
      connection: {
        host: configService.getValue('MYSQL_HOST'),
        port: parseInt(configService.getValue('MYSQL_PORT'), 10),
        user: configService.getValue('MYSQL_USER'),
        password: configService.getValue('MYSQL_PASSWORD'),
        database: configService.getValue('MYSQL_DATABASE'),
      },
      dumpToFile: join(__dirname, '..', '..', '..', 'backup', backupFileName),
      compressFile: true,
    });

    const templatePath = join(__dirname, '..', '..', '..', 'backup', backupFileName);
    const templateFile = fs.readFileSync(templatePath);

    await this.uploadBackup({
      fieldname: backupFileName,
      originalname: backupFileName,
      encoding: 'gzip',
      mimetype: 'application/gzip',
      buffer: templateFile,
      size: templateFile.length.toString()
    })

    return true;
  }
}
