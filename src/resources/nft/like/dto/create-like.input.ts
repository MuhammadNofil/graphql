import { InputType, Int, Field } from '@nestjs/graphql';
import { IsOptional, IsString } from 'class-validator';

@InputType()
export class CreateLikeInput {
  @Field(() => String, {})
  @IsString()
  nftId: string;
}
