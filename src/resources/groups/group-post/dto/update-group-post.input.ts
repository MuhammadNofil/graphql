
import { InputType, Field, Int, PartialType } from '@nestjs/graphql';
import { IsString } from 'class-validator';

@InputType()
export class UpdateGrouppostInput  {
  
  @IsString()
  @Field(() => String)
  id: string;

  @IsString()
  @Field(() => String)
  description: string;
}
