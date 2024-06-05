import { CreateSocialProfileInput } from './create-social-profile.input';
import { InputType, Field, Int, PartialType, ID } from '@nestjs/graphql';

@InputType()
export class UpdateSocialProfileInput extends PartialType(CreateSocialProfileInput) {
  @Field(() => ID)
  id: string;
}
