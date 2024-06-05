import { InputType, Int, Field } from '@nestjs/graphql';
import { IsBoolean, IsNotEmpty, IsString } from 'class-validator';

@InputType()
export class CreateGroupMemberInput {
  @Field(() => String, { nullable: false })
  @IsNotEmpty()
  @IsString()
  groupId: string;

  @Field(() => String, { nullable: false })
  @IsNotEmpty()
  @IsString()
  role: string;

  @Field(() => Boolean, { description: 'User deleted check', nullable: false })
  @IsNotEmpty()
  @IsBoolean()
  isMuted: boolean;
}
