import { Controller, Get, Header, Query, Res } from '@nestjs/common';
import { AppService } from './app.service';
import { FileService } from './shared/file/file.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService, private readonly file: FileService) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @Get('read-image')
  @Header('Content-Type', 'video/mp4')
  async readImage(@Res() res, @Query('filename') filename: string) {
    const file = await this.file.readFile(filename);
    return file.pipe(res);
  }
}
