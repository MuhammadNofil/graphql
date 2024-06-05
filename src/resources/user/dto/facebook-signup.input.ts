import { Field, InputType } from '@nestjs/graphql';
import { IsNotEmpty, IsNumberString, IsString } from 'class-validator';

@InputType()
export class FacebookSigninDTO {
  @Field(() => String, { nullable: false })
  // @ApiProperty()
  @IsNotEmpty()
  @IsNumberString()
  facebookUserId: string;

  //   @ApiProperty()
  @Field(() => String, { nullable: false })
  @IsNotEmpty()
  @IsString()
  accessToken: string;
}
