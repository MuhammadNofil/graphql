import { Field, InputType } from '@nestjs/graphql';
import { IsEmail, IsNotEmpty, IsOptional, IsString, MaxLength, MinLength } from 'class-validator';

@InputType()
export class SignInDto {
  @Field(() => String)
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @Field(() => String)
  @IsNotEmpty()
  @IsString()
  @MinLength(8, { message: `Password Must Be Longer Than 8 Characters` })
  @MaxLength(20, { message: `Password Must Be Less Than 20 Characters` })
  password: string;

  @IsOptional()
  @IsString()
  @Field(() => String, { nullable: true })
  signature: string;
}
