import { JwtModuleOptions } from '@nestjs/jwt';
import { config } from 'dotenv';
config();

console.log(process.env.JWT_SECRET);
export const jwtConfig: JwtModuleOptions = {
  secret: process.env.JWT_SECRET || 'devSecret',
  // secretOrKeyProvider: 'topSecret',
  signOptions: {
    expiresIn: +process.env.JWT_EXPIRE_IN || 360000,
  },
};
