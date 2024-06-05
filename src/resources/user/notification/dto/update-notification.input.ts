import { IsNotEmpty, IsString } from 'class-validator';
import { CreateNotificationInput } from './create-notification.input';
import { InputType, Field, Int, PartialType } from '@nestjs/graphql';

@InputType()
export class UpdateNotificationInput {
  @Field(() => String)
  @IsNotEmpty()
  @IsString()
  id: string;
}
