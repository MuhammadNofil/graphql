import { Field, InputType } from '@nestjs/graphql';

@InputType()
export class FilterFollowDto {
  @Field(() => String, { description: 'name of the person you want.' })
  name: string;
}
