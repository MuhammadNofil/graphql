import { Field, InputType } from '@nestjs/graphql';
import { RATING } from '@prisma/client';
import { IsOptional, IsString } from 'class-validator';

@InputType()
export class FilterReportNftDto {
  @IsOptional()
  @IsString()
  @Field(() => String, { description: 'title of the nft', nullable: true })
  reportType: string;

  @IsOptional()
  @IsString()
  @Field(() => Boolean, { description: 'title of the nft', nullable: true })
  resolved: boolean;

  @IsOptional()
  @IsString()
  @Field(() => String, { description: 'nft title', nullable: true })
  nftTitle: string;
}
