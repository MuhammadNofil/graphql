import { ObjectType, Field, Int, ID, Directive } from '@nestjs/graphql';
import { Paginated } from 'src/common/pagination/pagination.entity';
import { Profile } from '../../entities/profile.entity';

@ObjectType()
@Directive('@key(fields: "id")')
export class Follow {
  @Field(() => ID, { description: 'follow ID', nullable: false })
  id: string;

  @Field(() => String, { description: 'profile ID', nullable: false })
  followerProfileId: string;

  @Field(() => Profile, { description: 'profile', nullable: false })
  followerProfile: Profile;

  @Field(() => String, { description: 'profile ID', nullable: false })
  followedProfileId: string;

  @Field(() => Profile, { description: 'profile', nullable: false })
  followedProfile: Profile;

  @Field(() => Boolean, { description: 'is followed property', nullable: false })
  isFollowed: boolean;

  @Field(() => Date, { description: 'created date time', nullable: false })
  createdAt: Date;

  @Field(() => Date, { description: 'updated date time', nullable: false })
  updatedAt: Date | null;

  @Field(() => Boolean, { description: 'soft delete property', nullable: false })
  deleted: boolean;
}

@ObjectType()
export class PaginatedFollow extends Paginated(Follow) {}
