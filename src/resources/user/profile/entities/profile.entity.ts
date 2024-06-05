import { ObjectType, Field, Int, ID, registerEnumType, Directive } from '@nestjs/graphql';
import { GENDER } from '@prisma/client';
import { BADGES } from 'src/common/constants';
import { MessageEntity } from 'src/common/message.entity';
import { Paginated } from 'src/common/pagination/pagination.entity';
import { Group } from 'src/resources/groups/entities/group.entity';
import { GroupPost } from 'src/resources/groups/group-post/entities/group-post.entity';
import { NftImpression } from 'src/resources/nft/analytics/nft-impression/entities/nft-impression.entity';
import { NftView } from 'src/resources/nft/analytics/nft-view/entities/nft-view.entity';
import { Comment } from 'src/resources/nft/comment/entities/comment.entity';
import { Nft } from 'src/resources/nft/entities/nft.entity';
import { RateNft } from 'src/resources/nft/rate-nft/entities/rate-nft.entity';
import { User } from '../../entities/user.entity';
import { SocialProfile } from '../social-profile/entities/social-profile.entity';
registerEnumType(GENDER, {
  name: 'GENDER',
  description: 'Enum for gender',
});

registerEnumType(BADGES, {
  name: 'BADGES',
  description: 'Enum for BADGES',
});

@ObjectType()
@Directive('@key(fields: "id")')
export class Profile {
  @Field(() => ID, { description: 'Example field (placeholder)' })
  id: string;

  @Field(() => String, { description: 'Example field (placeholder)', nullable: true })
  profilePicture: string | null;

  @Field(() => String, { description: 'Example field (placeholder)', nullable: true })
  banner: string | null;

  @Field(() => String, { description: 'Example field (placeholder)', nullable: true })
  name?: string;

  @Field(() => String, { description: 'Example field (placeholder)', nullable: true })
  userId: string;

  @Field(() => User, { description: 'user', nullable: true })
  user: User;

  @Field(() => [String], { description: 'Example field (placeholder)', nullable: true })
  interests: string[];

  @Field(() => String, { description: 'Example field (placeholder)', nullable: true })
  bio: string | null;

  @Field(() => String, { description: 'Example field (placeholder)', nullable: true })
  address: string | null;

  @Field(() => GENDER, { description: 'Example field (placeholder)', nullable: true })
  gender: GENDER;

  @Field(() => Number, { description: 'points profile has', nullable: false })
  points: number;

  @Field(() => Number, { description: 'coins profile has', nullable: false })
  coins: number;

  @Field(() => Date, { description: 'Example field (placeholder)', nullable: true })
  dateOfBirth: Date | null;

  @Field(() => [SocialProfile], { description: 'Example field (placeholder)', nullable: true })
  socialProfile: SocialProfile[];

  @Field(() => [Group], { description: 'Example field (placeholder)', nullable: true })
  group: Group[];

  @Field(() => [NftImpression], { description: 'Example field (placeholder)', nullable: true })
  nftImpression: NftImpression[];

  @Field(() => [NftView], { description: 'Example field (placeholder)', nullable: true })
  nftView: NftView[];

  @Field(() => [GroupPost], { description: 'Example field (placeholder)', nullable: true })
  groupPost: GroupPost[];

  @Field(() => [Comment], { description: 'Example field (placeholder)', nullable: true })
  comment: Comment[];

  @Field(() => Number)
  likesCount: number;

  @Field(() => Number)
  followedCount: number;

  @Field(() => Number)
  followersCount: number;

  @Field(() => Boolean)
  isFollowed: boolean;

  @Field(() => Boolean)
  verified: boolean;

  @Field(() => BADGES)
  badges: BADGES | MessageEntity

  @Field(() => Date, { nullable: true })
  profileFeature: Date

  @Field(() => Number)
  swipe: number;

  @Field(() => [Nft])
  nft: Nft[];

  @Field(() => [RateNft])
  rateNft: RateNft;

  @Field(() => Date, { description: 'Example field (placeholder)' })
  createdAt: Date;

  @Field(() => Date, { description: 'Example field (placeholder)' })
  updatedAt: Date | null;

  @Field(() => Boolean, { description: 'Example field (placeholder)' })
  deleted: boolean;

}


@ObjectType()
export class PaginatedProfile extends Paginated(Profile) { }
