import { Field, InputType } from '@nestjs/graphql';
import { IsNotEmpty, IsString } from 'class-validator';

@InputType()
export class GoogleAccessTokenInput {
  @Field(() => String, { nullable: false })
  @IsNotEmpty()
  @IsString()
  accessToken: string;
}
