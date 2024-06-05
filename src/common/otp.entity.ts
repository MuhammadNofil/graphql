import { ObjectType, Field } from '@nestjs/graphql';

@ObjectType()
export class OtpEntity {
  @Field(() => String, { description: 'response message', nullable: false })
  otp: string;
}
