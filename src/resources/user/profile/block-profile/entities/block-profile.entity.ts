import { ObjectType, Field, Int, ID, Directive } from '@nestjs/graphql';
import { Profile } from '../../entities/profile.entity';

@ObjectType()
@Directive('@key(fields: "id")')
export class BlockProfile {
  @Field(() => ID, { description: 'follow ID', nullable: false })
  id: string;

  @Field(() => String, { description: 'profile ID', nullable: false })
  profileId: string;

  @Field(() => Profile, { description: 'profile', nullable: false })
  profile: Profile;

  @Field(() => String, { description: 'profile ID', nullable: false })
  blockedProfileId: string;

  @Field(() => Profile, { description: 'profile', nullable: false })
  blockedProfile: Profile;

  @Field(() => Boolean, { description: 'is blocked property', nullable: false })
  isBlocked: boolean;

  @Field(() => Date, { description: 'created date time', nullable: false })
  createdAt: Date;

  @Field(() => Date, { description: 'updated date time', nullable: false })
  updatedAt: Date | null;

  @Field(() => Boolean, { description: 'soft delete property', nullable: false })
  deleted: boolean;
}
