import { InputType, Int, Field } from '@nestjs/graphql';
import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

@InputType()
export class CreateGroupInput {
  @Field(() => String, { nullable: true })
  @IsOptional()
  @IsString()
  banner: string;

  @Field(() => String, { nullable: false })
  @IsString()
  name: string;

  @Field(() => Boolean, { nullable: false })
  @IsNotEmpty()
  isPrivate: boolean;

  @Field(() => String, { nullable: true })
  @IsOptional()
  @IsString()
  category: string;

  @Field(() => String, { nullable: true })
  @IsOptional()
  @IsString()
  displayImage: string;
}
