import { CreateNftViewInput } from './create-nft-view.input';
import { InputType, Field, Int, PartialType } from '@nestjs/graphql';

@InputType()
export class UpdateNftViewInput extends PartialType(CreateNftViewInput) {
  @Field(() => Int)
  id: number;
}
