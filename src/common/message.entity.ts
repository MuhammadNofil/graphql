import { ObjectType, Field } from '@nestjs/graphql';

@ObjectType()
export class MessageEntity {
  @Field(() => String, { description: 'response message', nullable: false })
  message: string;
}
