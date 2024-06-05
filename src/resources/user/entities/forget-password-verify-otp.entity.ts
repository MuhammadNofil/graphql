import { ObjectType, Field, Int, ID, Directive } from '@nestjs/graphql';
import { Role } from './role.entity';
import { User } from './user.entity';

@ObjectType()
export class ForgetPasswordVerifyOtp {
  @Field(() => String, { description: 'forget password JWT token', nullable: false })
  token: string;
}
