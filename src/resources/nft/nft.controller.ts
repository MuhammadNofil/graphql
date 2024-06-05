import { Controller, Get, Headers, Query, Req, Res } from '@nestjs/common';
import { Response, Request } from 'express';
import { BASE_URL } from 'src/common/constants';
import { NftService } from './nft.service';

@Controller('nft')
export class NftController {
  constructor(private readonly nftService: NftService) {}

  @Get()
  async getNftViaSignature(
    @Query('signature') signature: string,
    @Res() res: Response,
    @Req() req: Request,
    @Headers() headers,
  ) {
    // console.log(req);
    console.log('user-agent');
    console.log(headers['user-agent']);
    console.log('user-agent');
    try {
      const url = await this.nftService.getNftIdViaSignature(signature);
      res.redirect(url);
      return url;
    } catch (error) {
      const url = `${BASE_URL}/?error=${error}`;
      res.redirect(url);
      return url;
    }
  }
}
