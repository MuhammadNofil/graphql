import { Injectable } from '@nestjs/common';
import { randomBytes } from 'crypto';
import { AES, enc, HmacSHA512 } from 'crypto-js';

@Injectable()
export class CrypterService {
  public randomCryptoData(): string {
    return randomBytes(20).toString('hex');
  }

  public encrypt(message: string): string {
    const hash = AES.encrypt(message, process.env.SECRET).toString();
    return hash;
  }

  public decrypt(hash: string, tokenData: string): boolean {
    const bytes = AES.decrypt(hash, process.env.SECRET);
    const decryptedMessage = bytes.toString(enc.Utf8);
    return decryptedMessage === tokenData;
  }

  public generateHMAC(message: string): string {
    const hash = HmacSHA512(message, process.env.SECRET).toString();
    return hash;
  }
}
