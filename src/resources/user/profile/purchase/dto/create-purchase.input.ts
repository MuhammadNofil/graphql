import { InputType, Int, Field } from '@nestjs/graphql';

@InputType()
export class CreatePurchaseInput {
  @Field(() => Int, { description: 'Example field (placeholder)' })
  exampleField: number;
}
