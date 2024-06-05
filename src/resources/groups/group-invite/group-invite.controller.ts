import { Controller, Get, Query, Res } from '@nestjs/common';
import { Response } from 'express';
import { BASE_URL } from 'src/common/constants';
import { GroupInviteService } from './group-invite.service';

@Controller('group-invite')
export class GroupInviteController {
  constructor(private readonly groupInviteService: GroupInviteService) {}
  @Get()
  async handleInvite(@Query('signature') signature: string, @Res() res: Response) {
    try {
      const url = await this.groupInviteService.handleInvite(signature);
      res.redirect(url);
      return url;
    } catch (error) {
      const url = `${BASE_URL}/magic_signin?error=${error}`;
      res.redirect(url);
      return url;
    }
  }
}
