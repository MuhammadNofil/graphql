import { InputType, Int, Field } from '@nestjs/graphql';
import { IsNotEmpty, IsString } from 'class-validator';

@InputType()
export class CreateNftImpressionInput {
  @IsNotEmpty()
  @IsString()
  @Field(() => String, { nullable: false })
  nftId: string;
}
