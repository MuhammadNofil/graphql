import { ObjectType, Field, Int, ID, Directive } from '@nestjs/graphql';
import { Role } from './role.entity';
import { User } from './user.entity';

@ObjectType()
@Directive('@key(fields: "id")')
export class SignIn {
  @Field(() => User, { description: 'User', nullable: false })
  user: User;

  @Field(() => String, { description: 'User JWT token', nullable: false })
  token: string;
}
