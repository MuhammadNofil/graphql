import { InputType, Int, Field } from '@nestjs/graphql';
import { IsNotEmpty, IsString } from 'class-validator';

@InputType()
export class CreateReportProfileInput {
  @IsNotEmpty()
  @IsString()
  @Field(() => String, { nullable: false })
  reportedProfileId: string;

  @IsNotEmpty()
  @IsString()
  @Field(() => String, { nullable: false })
  reportType: string;

  @IsNotEmpty()
  @IsString()
  @Field(() => String, { nullable: true })
  description: string;
}
