import { ObjectType, Field, Int, ID, Directive } from '@nestjs/graphql';
import { Profile } from '../../entities/profile.entity';

@ObjectType()
@Directive('@key(fields: "id")')
export class SocialProfile {
  @Field(() => ID, { description: 'profile ID', nullable: false })
  id: string;

  @Field(() => String, { description: 'profile picture', nullable: false })
  type: string;

  @Field(() => String, { description: 'interests array', nullable: false })
  url: string;

  @Field(() => String, { description: 'profile ID', nullable: false })
  profileId: string;

  @Field(() => Profile, { description: 'profile', nullable: false })
  profile: Profile;

  @Field(() => Date, { description: 'Example field (placeholder)', nullable: false })
  createdAt: Date;

  @Field(() => Date, { description: 'Example field (placeholder)', nullable: false })
  updatedAt: Date | null;

  @Field(() => Boolean, { description: 'Example field (placeholder)', nullable: false })
  deleted: boolean;
}
