import { ObjectType, Field, Int, ID, Float, Directive, registerEnumType } from '@nestjs/graphql';
import { NFT_TYPE } from '@prisma/client';
import { IsOptional } from 'class-validator';
import { Paginated } from 'src/common/pagination/pagination.entity';
import { GroupPost } from 'src/resources/groups/group-post/entities/group-post.entity';
import { Profile } from 'src/resources/user/profile/entities/profile.entity';
import { Wallet } from 'src/resources/user/wallet/entities/wallet.entity';
import { NftImpression } from '../analytics/nft-impression/entities/nft-impression.entity';
import { NftView } from '../analytics/nft-view/entities/nft-view.entity';
import { Comment } from '../comment/entities/comment.entity';
import { RateNft } from '../rate-nft/entities/rate-nft.entity';

registerEnumType(NFT_TYPE, {
  name: 'NFT_TYPE',
  description: 'Enum for Nft type',
});


@ObjectType()
export class NftStats {
  @Field(() => Number, { nullable: false, defaultValue: 0 })
  positive: number;

  @Field(() => Number, { nullable: false, defaultValue: 0 })
  negative: number;

  @Field(() => Number, { nullable: false, defaultValue: 0 })
  total: number;

}

@ObjectType()
@Directive('@key(fields: "id")')
export class Nft {
  @Field(() => ID, { description: 'follow ID', nullable: false })
  id: string;

  @Field(() => String, { nullable: false })
  profileId: string;

  @Field(() => Profile, { nullable: false })
  profile: Profile;

  @Field(() => [Comment], { nullable: true, defaultValue: [] })
  comment: Comment[];

  @Field(() => String, { nullable: false })
  walletId: string;

  @Field(() => Wallet, { nullable: false })
  wallet: Wallet;

  @Field(() => String, { nullable: false })
  image: string;

  @Field(() => String, { nullable: true })
  link: string;

  @Field(() => String, { nullable: false })
  title: string;

  @Field(() => String, { nullable: true })
  description: string;

  @Field(() => [String], { nullable: false })
  category: string[];

  @Field(() => Float, { nullable: true })
  price: number;

  @Field(() => String, { nullable: false })
  blockChain: string;

  @Field(() => String, { nullable: false })
  mediaHash: string;

  @Field(() => Date, { nullable: false })
  createdAt: Date;

  @Field(() => Date, { nullable: false })
  updatedAt: Date | null;

  @Field(() => Boolean, { nullable: false })
  deleted: boolean;

  @Field(() => Number, { nullable: true })
  likesCount: number;

  @Field(() => Number, { nullable: true })
  commentCount: number;

  @Field(() => Number, { description: 'Example field (placeholder)', nullable: true })
  nftImpression: number;

  @Field(() => Number, { description: 'Example field (placeholder)', nullable: true })
  nftView: number;

  @Field(() => [GroupPost], { description: 'Example field (placeholder)', nullable: true })
  groupPost: GroupPost[];

  @Field(() => NFT_TYPE, { description: 'Nft type', nullable: false })
  type: NFT_TYPE;

  @Field(() => Boolean, { nullable: false, defaultValue: false })
  isLiked: boolean;

  @Field(() => NftStats, { description: 'stats of nft', nullable: false })
  stats: NftStats;

  @Field(() => Date, { nullable: true, })
  nftFeature: Date

  @Field(() => [RateNft])
  rateNft: RateNft

}


@ObjectType()
export class PaginatedNft extends Paginated(Nft) { }
