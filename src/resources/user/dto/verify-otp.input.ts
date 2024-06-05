import { InputType, Int, Field } from '@nestjs/graphql';
import {
  IsAlpha,
  IsEmail,
  IsNotEmpty,
  IsNumberString,
  IsOptional,
  IsPhoneNumber,
  IsString,
  Matches,
  maxLength,
  MaxLength,
  MinLength,
} from 'class-validator';

@InputType()
export class VerifyOtpInput {
  @IsNotEmpty()
  @IsString()
  @IsEmail()
  @Field(() => String, { description: 'User email', nullable: false })
  email: string;

  @IsNotEmpty()
  @IsString()
  @Field(() => String, { description: 'User email', nullable: false })
  otp: string;
}
