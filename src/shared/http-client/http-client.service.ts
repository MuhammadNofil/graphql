import { BadRequestException, Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { FacebookSigninDTO } from 'src/resources/user/dto/facebook-signup.input';
import { Observable } from 'rxjs';
@Injectable()
export class HttpClientService {
  constructor(private readonly httpService: HttpService) {}

  async facebookGetUser(facebookSigninDTO: FacebookSigninDTO) {
    const { facebookUserId, accessToken } = facebookSigninDTO;
    const url = `https://graph.facebook.com/${facebookUserId}?fields=id,name,email,picture&access_token=${accessToken}`;
    const response = await this.httpService.get(url).toPromise();
    if (!response) {
      throw new BadRequestException(`Invalid facebook credentials`);
    }
    return response.data;
  }
}
