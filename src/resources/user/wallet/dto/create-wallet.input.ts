import { InputType, Field } from '@nestjs/graphql';
import { IsNotEmpty } from 'class-validator';

@InputType()
export class CreateWalletInput {

  @IsNotEmpty()
  @Field(() => String, { description: 'Example field (placeholder)' })
  address: string;
}
