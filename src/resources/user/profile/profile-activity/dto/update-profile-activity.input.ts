import { CreateProfileActivityInput } from './create-profile-activity.input';
import { InputType, Field, Int, PartialType } from '@nestjs/graphql';

@InputType()
export class UpdateProfileActivityInput extends PartialType(CreateProfileActivityInput) {
  @Field(() => Int)
  id: number;
}
