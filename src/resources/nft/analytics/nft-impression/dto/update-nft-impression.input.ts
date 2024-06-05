import { CreateNftImpressionInput } from './create-nft-impression.input';
import { InputType, Field, Int, PartialType } from '@nestjs/graphql';

@InputType()
export class UpdateNftImpressionInput extends PartialType(CreateNftImpressionInput) {
  @Field(() => Int)
  id: number;
}
