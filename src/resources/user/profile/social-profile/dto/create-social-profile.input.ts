import { InputType, Int, Field, ID } from '@nestjs/graphql';
import { IsNotEmpty, IsString, IsUrl } from 'class-validator';

@InputType()
export class CreateSocialProfileInput {
  @Field(() => String, { description: 'profile picture', nullable: false })
  @IsNotEmpty()
  @IsString()
  type: string;

  @Field(() => String, { description: 'interests array', nullable: false })
  @IsNotEmpty()
  @IsString()
  @IsUrl()
  url: string;
}
