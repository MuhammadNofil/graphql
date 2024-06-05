import { CreateCommentReplyInput } from './create-comment-reply.input';
import { InputType, Field, Int, PartialType } from '@nestjs/graphql';
import { IsNotEmpty, IsString } from 'class-validator';

@InputType()
export class UpdateCommentReplyInput extends PartialType(CreateCommentReplyInput) {
  @Field(() => String)
  @IsNotEmpty()
  @IsString()
  id: string;

  @Field(() => String, { nullable: false })
  @IsNotEmpty()
  @IsString()
  description: string;
}
