import { ObjectType, Field, Int, ID, registerEnumType, Directive } from '@nestjs/graphql';
import { GENDER } from '@prisma/client';

@ObjectType()
@Directive('@key(fields: "id")')
export class Interests {
  @Field(() => ID, { description: 'Example field (placeholder)', nullable: false })
  id: string;

  @Field(() => String, { description: 'Example field (placeholder)', nullable: false })
  title: string;

  @Field(() => Date, { description: 'Example field (placeholder)', nullable: false })
  createdAt: Date;

  @Field(() => Date, { description: 'Example field (placeholder)', nullable: false })
  updatedAt: Date | null;

  @Field(() => Boolean, { description: 'Example field (placeholder)', nullable: false })
  deleted: boolean;
}
