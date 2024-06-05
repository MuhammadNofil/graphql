import { ObjectType, Field, Int, ID } from '@nestjs/graphql';
import { Paginated } from 'src/common/pagination/pagination.entity';
import { Nft } from 'src/resources/nft/entities/nft.entity';
import { Profile } from 'src/resources/user/profile/entities/profile.entity';

@ObjectType()
export class NftImpression {
  @Field(() => ID, { nullable: false })
  id: string;

  @Field(() => String, { nullable: false })
  profileId: string;

  @Field(() => Profile, { nullable: false })
  profile: Profile;

  @Field(() => String, { nullable: false })
  nftId: string;

  @Field(() => Nft, { nullable: false })
  nft: Nft;

  @Field(() => Date, { description: 'User created at time', nullable: false })
  createdAt: Date;

  @Field(() => Date, { description: 'User updated at time', nullable: true })
  updatedAt: Date;

  @Field(() => Boolean, { description: 'User deleted check', nullable: false })
  deleted: boolean;
}

@ObjectType()
export class PaginatedNftImpression extends Paginated(NftImpression) {}
