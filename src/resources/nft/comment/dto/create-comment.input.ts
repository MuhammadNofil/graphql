import { InputType, Int, Field } from '@nestjs/graphql';
import { IsNotEmpty, IsString } from 'class-validator';

@InputType()
export class CreateCommentInput {
  @Field(() => String, { nullable: false })
  @IsNotEmpty()
  @IsString()
  nftId: string;

  @Field(() => String, { nullable: false })
  @IsNotEmpty()
  @IsString()
  description: string;
}
