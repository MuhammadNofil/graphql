import { CreateGroupMemberInput } from './create-group-member.input';
import { InputType, Field, Int, PartialType } from '@nestjs/graphql';

@InputType()
export class UpdateGroupMemberInput extends PartialType(CreateGroupMemberInput) {
  @Field(() => Int)
  id: number;
}
