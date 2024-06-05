import { Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import * as fs from 'fs';
import { PINATA_GATEWAY_URL } from 'src/common/constants';
import { PinataMetaDataReponse } from 'src/common/pinata-response.dto';
@Injectable()
export class JsonHelperService {
  constructor(private readonly httpService: HttpService) {}

  async readFile(fileUrl: string) {
    const response = await this.httpService.get(fileUrl).toPromise();
    return response?.data;
  }

  async ipfsPixura(fileUrl: string) {
    const data = await this.readFile(fileUrl);
    return data;
  }

  async ipfsPinata(hash: string): Promise<PinataMetaDataReponse> {
    const url = `${PINATA_GATEWAY_URL}/${hash}`;
    const data = await this.readFile(url);
    return data;
  }
}
