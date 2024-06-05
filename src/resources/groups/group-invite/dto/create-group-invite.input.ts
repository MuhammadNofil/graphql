import { InputType, Int, Field } from '@nestjs/graphql';
import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

@InputType()
export class CreateGroupInviteInput {
  @Field(() => String, { nullable: false })
  @IsNotEmpty()
  @IsString()
  groupId: string;

  @Field(() => String, { nullable: true })
  @IsOptional()
  @IsString()
  walletAddress?: string;

  @Field(() => String, { nullable: true })
  @IsOptional()
  @IsString()
  email?: string;



}
