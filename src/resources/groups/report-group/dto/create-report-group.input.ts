import { InputType, Int, Field } from '@nestjs/graphql';
import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

@InputType()
export class CreateReportGroupInput {
  @Field(() => String, { nullable: false })
  @IsNotEmpty()
  @IsString()
  groupId: string;

  @Field(() => String, { nullable: true })
  @IsOptional()
  @IsString()
  description: string;

  @Field(() => String, { nullable: false })
  @IsNotEmpty()
  @IsString()
  reportType: string;
}
