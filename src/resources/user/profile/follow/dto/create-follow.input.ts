import { InputType, Int, Field } from '@nestjs/graphql';
import { IsNotEmpty, IsString } from 'class-validator';

@InputType()
export class CreateFollowInput {
  @Field(() => String, { description: 'profile ID', nullable: false })
  @IsNotEmpty()
  @IsString()
  followedProfileId: string;
}
