import { InputType, Int, Field } from '@nestjs/graphql';

@InputType()
export class CreateProfileActivityInput {
  @Field(() => Int, { description: 'Example field (placeholder)' })
  exampleField: number;
}
