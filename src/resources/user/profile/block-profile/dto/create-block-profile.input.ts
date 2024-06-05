import { InputType, Field } from '@nestjs/graphql';
import { IsNotEmpty, IsString } from 'class-validator';

@InputType()
export class CreateBlockProfileInput {
  @IsNotEmpty()
  @IsString()
  @Field(() => String, { description: 'Example field (placeholder)', nullable: false })
  blockedProfileId: string;
}
