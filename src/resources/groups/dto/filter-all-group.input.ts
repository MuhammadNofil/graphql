import { Field, InputType } from '@nestjs/graphql';

@InputType()
export class FilterAllGroupDto{
  @Field(() => String, { description: 'name of group', nullable: true })
  name: string;
}
