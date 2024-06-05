import { Field, InputType } from '@nestjs/graphql';
import { NFT_TYPE } from '@prisma/client';
import { IsArray, IsEnum, IsNotEmpty, IsOptional, IsString } from 'class-validator';

@InputType()
export class FilterRecentNftDto {
  @IsOptional()
  @IsArray()
  @Field(() => [String], { description: 'description of the nft', nullable: true })
  category: string[];

  @IsOptional()
  @IsEnum([NFT_TYPE.EXTERNAL, NFT_TYPE.FORE])
  @Field(() => NFT_TYPE, { description: 'description of the nft', nullable: true })
  type: NFT_TYPE;

  @IsOptional()
  @Field(() => Boolean, { nullable: true, defaultValue: false })
  recent: boolean;

  @IsOptional()
  @Field(() => Boolean, { nullable: true, defaultValue: false })
  isFeatured: boolean;
}
