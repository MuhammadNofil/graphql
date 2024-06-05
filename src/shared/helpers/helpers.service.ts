import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { customAlphabet } from 'nanoid';
@Injectable()
export class HelpersService {
  constructor() {}

  async generatePassword(): Promise<string> {
    try {
      const chars = [
        'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz',
        '0123456789',
        'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789',
      ];
      const randPwd = [5, 3, 2]
        .map(function (len, i) {
          return Array(len)
            .fill(chars[i])
            .map(function (x) {
              return x[Math.floor(Math.random() * x.length)];
            })
            .join('');
        })
        .concat()
        .join('')
        .split('')
        .sort(function () {
          return 0.5 - Math.random();
        })
        .join('');
      return randPwd;
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }

  public randomNumbers(): string {
    const custom_alphabet = customAlphabet('0123456789', 6);
    return custom_alphabet();
  }
}
