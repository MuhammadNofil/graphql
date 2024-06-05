import { ObjectType, Field, Int, ID, Directive } from '@nestjs/graphql';
import { Role } from './role.entity';
import { User } from './user.entity';

@ObjectType()
export class ForgetPasswordOtp {
  @Field(() => String, { description: 'OTP to for forget password', nullable: false })
  otp: string;
}
