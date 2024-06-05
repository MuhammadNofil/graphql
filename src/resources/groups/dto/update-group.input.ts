import { CreateGroupInput } from './create-group.input';
import { InputType, Field, Int, PartialType } from '@nestjs/graphql';
import { IsBoolean, IsNotEmpty, IsOptional, IsString } from 'class-validator';

@InputType()
export class UpdateGroupInput extends PartialType(CreateGroupInput) {
  @Field(() => String, { nullable: true })
  @IsNotEmpty()
  @IsString()
  id: string;

  @Field(() => String, { nullable: true })
  @IsOptional()
  @IsString()
  banner: string;

  @Field(() => String, { nullable: false })
  @IsString()
  @IsNotEmpty()
  name: string;

  @Field(() => Boolean, { nullable: false })
  @IsNotEmpty()
  @IsBoolean()
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
