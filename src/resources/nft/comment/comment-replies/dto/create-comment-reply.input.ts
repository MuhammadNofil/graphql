import { InputType, Int, Field } from '@nestjs/graphql';
import { IsNotEmpty, IsString } from 'class-validator';

@InputType()
export class CreateCommentReplyInput {
  @Field(() => String, {})
  @IsString()
  @IsNotEmpty()
  commentId: string;

  @Field(() => String, { description: 'Example field (placeholder)' })
  @IsString()
  @IsNotEmpty()
  description: string;
}
