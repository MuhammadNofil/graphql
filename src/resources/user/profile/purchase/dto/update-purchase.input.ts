import { CreatePurchaseInput } from './create-purchase.input';
import { InputType, Field, Int, PartialType } from '@nestjs/graphql';

@InputType()
export class UpdatePurchaseInput extends PartialType(CreatePurchaseInput) {
  @Field(() => Int)
  id: number;
}
