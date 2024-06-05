import { Field, InputType } from '@nestjs/graphql';
import { IsOptional, IsString } from 'class-validator';

@InputType()
export class FilterGroupDto {
  
  @IsOptional()
  @IsString()
  @Field(() => String, { description: 'name of group', nullable: true })
  name: string;
}
