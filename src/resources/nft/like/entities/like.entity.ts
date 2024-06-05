import { ObjectType, Field, Int, Directive, ID, Float } from '@nestjs/graphql';
import { Paginated } from 'src/common/pagination/pagination.entity';
import { Profile } from 'src/resources/user/profile/entities/profile.entity';
import { Comment } from '../../comment/entities/comment.entity';
import { Nft } from '../../entities/nft.entity';

@ObjectType()
@Directive('@key(fields: "id")')
export class Like {
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

  @Field(() => Boolean, { nullable: false })
  deleted: boolean;

  @Field(() => Date, { nullable: false })
  createdAt: Date;

  @Field(() => Date, { nullable: false })
  updatedAt: Date | null;

  @Field(() => Boolean, { nullable: false })
  liked: boolean;
}

@ObjectType()
export class PaginatedLike extends Paginated(Like) {}

