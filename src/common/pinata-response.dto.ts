import { IsString, IsNumber, IsObject, IsArray } from 'class-validator';

export class MetadataDto {
  @IsString()
  name: string;

  @IsString()
  createdBy: string;

  @IsNumber()
  yearCreated: number;

  @IsString()
  description: string;

  @IsString()
  image: string;

  @IsObject()
  media: MediaDto;

  @IsArray()
  tags: string[];
}

export class MediaDto {
  @IsString()
  uri: string;

  @IsString()
  dimensions: string;

  @IsNumber()
  size: number;

  @IsString()
  mimeType: string;
}

export class PinataMetaDataReponse {
  @IsString()
  hash: string;

  @IsObject()
  metadata: MetadataDto;
}
