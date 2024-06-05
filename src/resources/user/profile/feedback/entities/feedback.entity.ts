import { ObjectType, Field, Int, Directive, ID } from '@nestjs/graphql';
import { Profile } from '../../entities/profile.entity';

@ObjectType()
@Directive('@key(fields: "id")')
export class Feedback {
  @Field(() => ID, { description: 'follow ID', nullable: false })
  id: string;

  @Field(() => String, { description: 'profile ID', nullable: false })
  profileId: string;

  @Field(() => Profile, { description: 'profile', nullable: false })
  profile: Profile;

  @Field(() => String, { description: 'is followed property', nullable: false })
  message: string;

  @Field(() => Date, { description: 'created date time', nullable: false })
  createdAt: Date;

  @Field(() => Date, { description: 'updated date time', nullable: false })
  updatedAt: Date | null;

  @Field(() => Boolean, { description: 'soft delete property', nullable: false })
  deleted: boolean;
}
