import { ObjectType, Field, Int, ID, Directive } from '@nestjs/graphql';
import { User } from '../../entities/user.entity';

@ObjectType()
@Directive('@key(fields: "id")')
export class Wallet {
  @Field(() => ID, { description: 'Example field (placeholder)' })
  id: string;

  @Field(() => String, { description: 'Example field (placeholder)' })
  address: string;

  @Field(() => String, { description: 'From session' })
  userId: string;

  @Field(() => User, { description: 'user', nullable: true })
  user: User;

  @Field(() => Date, { description: 'Example field (placeholder)' })
  createdAt: Date;

  @Field(() => Date, { description: 'Example field (placeholder)' })
  updatedAt: Date | null;

  @Field(() => Boolean, { description: 'Example field (placeholder)' })
  deleted: boolean;
}
