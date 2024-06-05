import { InputType, Int, Field } from '@nestjs/graphql';
import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

@InputType()
export class CreateNotificationInput {
  @IsNotEmpty()
  @IsString()
  @Field(() => String, { description: 'profile ID', nullable: false })
  userId: string;

  @IsOptional()
  @IsString()
  @Field(() => String, { description: 'profile ID', nullable: true })
  createdBy?: string;

  @IsNotEmpty()
  @IsString()
  @Field(() => String, { description: 'profile ID', nullable: false })
  title: string;

  @IsNotEmpty()
  @IsString()
  @Field(() => String, { description: 'profile ID', nullable: false })
  message: string;

  @IsNotEmpty()
  @IsString()
  @Field(() => String, { description: 'profile ID', nullable: false })
  refKey: string;

  @IsNotEmpty()
  @IsString()
  @Field(() => String, { description: 'profile ID', nullable: false })
  type: string;
}
