import { InputType, Int, Field, ID, Directive, registerEnumType } from '@nestjs/graphql';
import { RATING } from '@prisma/client';
import { IsEnum, IsNotEmpty, IsString } from 'class-validator';

registerEnumType(RATING, {
  name: 'RATING',
  description: 'The type of RATING',
});

@InputType()
export class CreateRateNftInput {
  @IsNotEmpty()
  @IsString()
  @Field(() => String, { nullable: false })
  nftId: string;

  @IsNotEmpty()
  @IsEnum([RATING.DISLIKE, RATING.LIKE])
  @Field(() => RATING, { nullable: false })
  rating: RATING;
}
