import { Field, InputType } from '@nestjs/graphql';
import { RATING } from '@prisma/client';
import { IsOptional, IsString } from 'class-validator';

@InputType()
export class FilterRateNftDto {
  @IsOptional()
  @Field(() => RATING, { description: 'title of the nft', nullable: true })
  rating: RATING;

  @IsOptional()
  @IsString()
  @Field(() => String, { description: 'nft title', nullable: true })
  nftTitle: string;
}
