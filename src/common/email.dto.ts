import { IsEmail, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class SingleEmailDTO {
  @IsNotEmpty()
  @IsEmail()
  receiver: string;

  @IsOptional()
  @IsString()
  otp: string;
}
