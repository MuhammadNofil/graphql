import { InputType, Int, Field } from '@nestjs/graphql';
import { IsString } from 'class-validator';

@InputType()
export class CreateCommentLikeInput {
  @Field(() => String, {})
  @IsString()
  commentId: string;
}
