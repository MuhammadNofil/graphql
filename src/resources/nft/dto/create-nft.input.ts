import { InputType, Int, Field, Float } from '@nestjs/graphql';
import { IsArray, IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';

@InputType()
export class CreateNftInput {
  @Field(() => String, { nullable: false })
  @IsNotEmpty()
  @IsString()
  image: string;

  @Field(() => String, { nullable: true })
  @IsOptional()
  @IsString()
  link: string;

  @Field(() => String, { nullable: false })
  @IsNotEmpty()
  @IsString()
  title: string;

  @Field(() => String, { nullable: true })
  @IsOptional()
  @IsString()
  description: string;

  @Field(() => String, { nullable: false })
  @IsNotEmpty()
  @IsString()
  mediaHash: string;

  @Field(() => [String], { nullable: false })
  @IsNotEmpty()
  @IsArray()
  category: string[];

  @Field(() => Float, { nullable: true })
  @IsNotEmpty()
  @IsNumber()
  price: number;

  @Field(() => String, { nullable: false })
  @IsNotEmpty()
  @IsString()
  blockChain: string;
}
