import { CreateGroupInviteInput } from './create-group-invite.input';
import { InputType, Field, Int, PartialType } from '@nestjs/graphql';

@InputType()
export class UpdateGroupInviteInput extends PartialType(CreateGroupInviteInput) {
  @Field(() => Int)
  id: number;
}
