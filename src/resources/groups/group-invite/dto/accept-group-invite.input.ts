import { InputType, Int, Field, registerEnumType } from '@nestjs/graphql';
import { IsEnum, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { GROUP_INVITE_ACCEPT_REJECT } from 'src/common/constants';

registerEnumType(GROUP_INVITE_ACCEPT_REJECT, {
  name: 'GROUP_INVITE_ACCEPT_REJECT',
  description: 'Accept or reject',
});

@InputType()
export class AcceptRejectGroupInviteInput {
  @Field(() => String, { nullable: false })
  @IsNotEmpty()
  @IsString()
  groupInviteId: string;

  @Field(() => GROUP_INVITE_ACCEPT_REJECT, { nullable: false, defaultValue: GROUP_INVITE_ACCEPT_REJECT.ACCEPT })
  @IsNotEmpty()
  @IsEnum([GROUP_INVITE_ACCEPT_REJECT.ACCEPT, GROUP_INVITE_ACCEPT_REJECT.REJECT])
  TYPE: GROUP_INVITE_ACCEPT_REJECT;
}
