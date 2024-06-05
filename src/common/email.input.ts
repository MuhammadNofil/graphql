import { Field, InputType } from '@nestjs/graphql';
import { IsEmail, IsNotEmpty, IsString, MaxLength, MinLength } from 'class-validator';

@InputType()
export class EmailInputType {
  @Field(() => String, { nullable: false })
  @IsNotEmpty()
  @IsEmail()
  email: string;
}
