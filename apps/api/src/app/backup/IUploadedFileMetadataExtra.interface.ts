import { UploadedFileMetadata } from "@nestjs/azure-storage";

export interface IUploadedFileMetadataExtra extends UploadedFileMetadata {
  url: string
}
