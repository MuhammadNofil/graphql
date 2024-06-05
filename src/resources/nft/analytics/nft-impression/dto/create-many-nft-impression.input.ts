import { InputType, Int, Field } from '@nestjs/graphql';
import { IsNotEmpty, IsString } from 'class-validator';

@InputType()
export class CreateManyNftImpressionInput {
  @IsNotEmpty()
  @IsString()
  @Field(() => [String], { nullable: false })
  nftIds: string[];
}
