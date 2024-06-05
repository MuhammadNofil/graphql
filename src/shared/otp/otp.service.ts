import { Injectable } from '@nestjs/common';
import { CrypterService } from '../crypter/crypter.service';

@Injectable()
export class OtpService {
  private timeStep = 60; //number of seconds the token is valid for...
  private digits = 6; //length of token
  constructor(private readonly crypter: CrypterService) { }

  public generateTotpToken(digits?: number, timeStep?: number): string {
    if (timeStep) {
      this.timeStep = timeStep;
    }
    if (digits) {
      this.digits = digits;
    }
    const epoch = Math.floor(Date.now() / 1000 / this.timeStep);
    const token = this.generateTotpTokenFromEpoch(epoch, this.digits);

    if (token.includes("NaN")) {
      return this.generateTotpToken();
    }
    return token;
  }

  public verifyTotpToken(token?: string, digits?: number): boolean {
    const epoch = Math.floor(Date.now() / 1000 / this.timeStep);
    const currentToken = this.generateTotpTokenFromEpoch(epoch, digits || this.digits);
    const previousToken = this.generateTotpTokenFromEpoch(epoch - 1, digits || this.digits);
    return currentToken === token || previousToken === token;
  }

  private generateTotpTokenFromEpoch(epoch: number, digits: number): string {
    const hash = this.crypter.generateHMAC(epoch.toString());
    const offset = parseInt(hash.substring(hash.length - 1), 16);
    const token = parseInt(hash.substring(offset * 2, digits * 2), 16) % Math.pow(10, digits);
    return token.toString().padStart(digits, '0');
  }
}
