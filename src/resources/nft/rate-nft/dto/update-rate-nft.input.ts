import { CreateRateNftInput } from './create-rate-nft.input';
import { InputType, Field, Int, PartialType } from '@nestjs/graphql';

@InputType()
export class UpdateRateNftInput extends PartialType(CreateRateNftInput) {
  @Field(() => Int)
  id: number;
}
