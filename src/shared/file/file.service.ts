import { Injectable } from '@nestjs/common';
import { S3 } from 'aws-sdk';

@Injectable()
export class FileService {
  /**
   * @param  {string} base64
   * @param  {string} userId
   * @param  {string} file_path
   */
  async uploadFileGenericBase64(base64: string, userId: string, file_path: string) {
    const time = new Date().getTime();
    const s3 = new S3({
      accessKeyId: process.env.AWS_ACCESS_KEY_ID,
      secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    });
    const base64Data = Buffer.from(base64.replace(/^data:image\/\w+;base64,/, ''), 'base64');
    const type = base64.split(';')[0].split('/')[1];
    const uploadResult: S3.ManagedUpload.SendData = await s3
      .upload({
        Bucket: process.env.AWS_PUBLIC_BUCKET_NAME,
        Body: base64Data,
        ContentEncoding: 'Base64',
        ContentType: `image/${type}`,
        Key: file_path + '-userID' + userId + '-' + time + '.' + type,
      })
      .promise();
    return { url: uploadResult.Location, key: uploadResult.Key };
  }

  async readFile(fileName: string) {
    const s3 = new S3({
      accessKeyId: process.env.AWS_ACCESS_KEY_ID,
      secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    });
    const file = s3.getObject({ Bucket: process.env.AWS_PUBLIC_BUCKET_NAME, Key: fileName }).createReadStream();
    return file;
  }

  async uploadBufferFile(buffer: Buffer, file_path: string, name: string, mimeType: string) {
    const time = new Date().getTime();
    const s3 = new S3({
      accessKeyId: process.env.AWS_ACCESS_KEY_ID,
      secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    });
    const fileType = mimeType.split('/');
    const type = fileType[1];
    const uploadResult: S3.ManagedUpload.SendData = await s3
      .upload({
        Bucket: process.env.AWS_PUBLIC_BUCKET_NAME,
        Body: buffer,
        Key: file_path + '-' + name + '-' + time + '.' + type,
      })
      .promise();
    console.log(
      '🚀 ~ file: file.service.ts:56 ~ FileService ~ uploadBufferFile ~ { url: uploadResult.Location, key: uploadResult.Key }',
      { url: uploadResult.Location, key: uploadResult.Key },
    );
    return { url: uploadResult.Location, key: uploadResult.Key };
  }
}
