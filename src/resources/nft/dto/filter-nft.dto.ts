import { Field, InputType } from '@nestjs/graphql';
import { IsArray, IsNotEmpty, IsOptional, IsString } from 'class-validator';

@InputType()
export class FilterNftDto {
  @IsOptional()
  @IsString()
  @Field(() => String, { description: 'title of the nft', nullable: true })
  title: string;

  @IsOptional()
  @IsString()
  @Field(() => String, { description: 'description of the nft', nullable: true })
  description: string;

  @IsOptional()
  @IsArray()
  @Field(() => [String], { description: 'description of the nft', nullable: true })
  category: string[];
}
