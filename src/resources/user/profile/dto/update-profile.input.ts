import { CreateProfileInput } from './create-profile.input';
import { InputType, Field, Int, PartialType } from '@nestjs/graphql';
import { GENDER } from '@prisma/client';
import { IsArray, IsBase64, IsNotEmpty, IsOptional, IsString, IS_BASE64, Matches } from 'class-validator';

@InputType()
export class UpdateProfileInput extends PartialType(CreateProfileInput) {
  @Field(() => String, { description: 'profile picture', nullable: true })
  @IsOptional()
  @IsString()
  profilePicture: string;

  @Field(() => String, { description: 'profile picture', nullable: true })
  @IsOptional()
  @IsString()
  banner: string;

  @Field(() => [String], { description: 'interests array', nullable: true })
  @IsOptional()
  @IsArray()
  interests: string[] = [];

  @Field(() => String, { description: 'profile bio', nullable: true })
  @IsOptional()
  @IsString()
  bio: string;

  @Field(() => String, { description: 'address', nullable: true })
  @IsOptional()
  @IsString()
  address: string;

  @Field(() => GENDER, { description: 'gender', nullable: true })
  @IsOptional()
  gender: GENDER = GENDER.MALE;

  @Field(() => Date, { description: 'date of birth', nullable: true })
  @IsOptional()
  dateOfBirth: Date;
}
