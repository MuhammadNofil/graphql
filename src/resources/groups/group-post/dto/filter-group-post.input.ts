import { Field, InputType } from '@nestjs/graphql';
import { IsOptional, IsString } from 'class-validator';

@InputType()
export class FilterGroupPostDto {
  
  @IsOptional()
  @IsString()
  @Field(() => String, { description: 'title of the nft', nullable: true })
  nftTitle: string;

  
  @IsOptional()
  @IsString()
  @Field(() => String, { description: 'description of the GroupPost', nullable: true })
  description: string;
}
