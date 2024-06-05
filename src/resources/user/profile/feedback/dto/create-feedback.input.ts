import { InputType, Int, Field } from '@nestjs/graphql';
import { IsNotEmpty } from 'class-validator';

@InputType()
export class CreateFeedbackInput {
  @IsNotEmpty()
  @Field(() => String, { description: 'is followed property', nullable: false })
  message: string;
}
