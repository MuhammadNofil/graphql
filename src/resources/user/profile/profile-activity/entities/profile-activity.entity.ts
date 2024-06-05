import { ObjectType, Field } from '@nestjs/graphql';
import { Paginated } from 'src/common/pagination/pagination.entity';
import {  PaginatedComment } from 'src/resources/nft/comment/entities/comment.entity';
import { PaginatedLike } from 'src/resources/nft/like/entities/like.entity';
import { PaginatedRateNft} from 'src/resources/nft/rate-nft/entities/rate-nft.entity';

@ObjectType()
export class ProfileActivity {
  @Field(() => PaginatedComment, { description: 'Paginated Comment entity type' })
  comment: PaginatedComment;

  @Field(() => PaginatedLike, { description: 'Paginated Like entity type' })
  like: PaginatedLike;

  @Field(() => PaginatedRateNft, { description: 'Paginated Rate-Nft entity type' })
  ratedArtWork: PaginatedRateNft;

}
