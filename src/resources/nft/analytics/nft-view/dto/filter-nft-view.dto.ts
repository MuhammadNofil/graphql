import { Field, InputType } from '@nestjs/graphql';
import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

@InputType()
export class FilterNftViewDto {
  @IsOptional()
  @IsString()
  @Field(() => String, { description: 'nft Id', nullable: true })
  nftId: string;

  @IsOptional()
  @Field(() => Date, { description: 'description of the nft', nullable: true })
  before: Date;

  @IsOptional()
  @Field(() => Date, { description: 'description of the nft', nullable: true })
  after: Date;
}
