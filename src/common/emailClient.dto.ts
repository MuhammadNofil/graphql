import { IsEmail, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class SingleEmailClientDTO {
  @IsNotEmpty()
  @IsEmail()
  receiver: string;

  @IsNotEmpty()
  @IsEmail()
  sender: string;

  @IsNotEmpty()
  @IsString()
  subject: string;

  @IsOptional()
  @IsString()
  html: string;
}
