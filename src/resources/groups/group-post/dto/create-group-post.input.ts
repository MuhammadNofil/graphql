import { InputType, Int, Field } from '@nestjs/graphql';
import { IsNotEmpty, IsString } from 'class-validator';

@InputType()
export class CreateGrouppostInput {
  @Field(() => String, { nullable: false })
  @IsNotEmpty()
  @IsString()
  nftId: string;

  @Field(() => String, { nullable: false })
  @IsNotEmpty()
  @IsString()
  groupId: string;

  @Field(() => String, { nullable: false })
  @IsNotEmpty()
  @IsString()
  description: string;}
