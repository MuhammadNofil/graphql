import { ObjectType, Field, Int, ID, Directive, registerEnumType } from '@nestjs/graphql';
import { RATING } from '@prisma/client';
import { Paginated } from 'src/common/pagination/pagination.entity';
import { Profile } from 'src/resources/user/profile/entities/profile.entity';
import { Nft } from '../../entities/nft.entity';

registerEnumType(RATING, {
  name: 'RATING',
  description: 'The type of RATING',
});

@ObjectType()
@Directive('@key(fields: "id")')
export class RateNft {
  @Field(() => ID, { description: 'follow ID', nullable: false })
  id: string;

  @Field(() => String, { nullable: false })
  profileId: string;

  @Field(() => Profile, { nullable: false })
  profile: Profile;

  @Field(() => String, { nullable: false })
  nftId: string;

  @Field(() => Nft, { nullable: false })
  nft: Nft;

  @Field(() => RATING, { nullable: false })
  rating: RATING;

  @Field(() => Date, { nullable: false })
  createdAt: Date;

  @Field(() => Date, { nullable: false })
  updatedAt: Date | null;

  @Field(() => Boolean, { nullable: false })
  deleted: boolean;

  @Field(() => Number, { nullable: true })
  likesCount: number;
}

@ObjectType()
export class PaginatedRateNft extends Paginated(RateNft) {}
