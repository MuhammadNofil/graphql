import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import * as sharp from 'sharp';

@Injectable()
export class CompressionHelperService {
  constructor(private readonly httpService: HttpService) {}
  /**
   * @param  {Buffer} input
   */
  async readMetadata(input: Buffer) {
    const image = sharp(input);
    const { width, height } = await image.metadata();
    return { width, height, image };
  }

  /**
   * @param  {string} input
   * @param  {string} output
   * @param  {number} compression percentage
   */
  async compressImage(imageUrl: string, compression: number) {
    // Read the input image
    const response = await this.httpService.get(imageUrl, { responseType: 'arraybuffer' }).toPromise();
    const input = Buffer.from(response.data);
    const { width, height, image } = await this.readMetadata(input);
    const options = {
      width: Math.round(width / 100) * (100 - compression), //calculate the size to be compressed at
      height: Math.round(height / 100) * (100 - compression), //calculate the size to be compressed at
    };
    const compressedImage = await image.resize(options).toBuffer();
    return compressedImage;
  }
}
