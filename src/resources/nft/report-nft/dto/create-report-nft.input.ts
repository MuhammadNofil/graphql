import { InputType, Int, Field } from '@nestjs/graphql';
import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

@InputType()
export class CreateReportNftInput {
  @IsNotEmpty()
  @IsString()
  @Field(() => String, { description: 'profile ID', nullable: false })
  nftId: string;

  @IsOptional()
  @IsString()
  @Field(() => String, { description: 'description', nullable: true })
  description: string;

  @IsNotEmpty()
  @IsString()
  @Field(() => String, { description: 'report type', nullable: false })
  reportType: string;
}
