import { Resolver, Query, Mutation, Args, Int, ResolveField, Parent } from '@nestjs/graphql';
import { LikeService } from './like.service';
import { Like, PaginatedLike } from './entities/like.entity';
import { CreateLikeInput } from './dto/create-like.input';
import { UpdateLikeInput } from './dto/update-like.input';
import { UseGuards } from '@nestjs/common';
import { GqlAuthGuard } from 'src/shared/guards/gql-authguard';
import { CommentService } from '../comment/comment.service';
import { PaginatedLikedDto } from './dto/paginated-like.dto';

@Resolver(() => Like)
export class LikeResolver {
  constructor(private readonly likeService: LikeService) {}

  @UseGuards(GqlAuthGuard)
  @Mutation(() => Like)
  createLike(@Args('createLikeInput') createLikeInput: CreateLikeInput) {
    return this.likeService.create(createLikeInput);
  }
  @UseGuards(GqlAuthGuard)
  @Query(() => [Like])
  findAllLikes(@Args('nftId') nftId: string) {
    return this.likeService.findAll(nftId);
  }

  @UseGuards(GqlAuthGuard)
  @Query(() => [Like])
  findLikes(@Args('nftId') nftId: string) {
    return this.likeService.findLikes(nftId);
  }

  @UseGuards(GqlAuthGuard)
  @Query(() => PaginatedLike)
  findPaginatedLikes(@Args('paginatedLikeDto') paginatedLikeDto: PaginatedLikedDto) {
    return this.likeService.paginatedLiked(paginatedLikeDto);
  }

  @UseGuards(GqlAuthGuard)
  @Query(() => Like)
  notification_like(@Args('id', { type: () => String }) id: string) {
    return this.likeService.notification_Like(id);
  }

  @ResolveField()
  async nft(@Parent() like: Like) {
    const { nftId } = like;
    return this.likeService.populateNft(nftId);
  }
  @ResolveField()
  async profile(@Parent() like: Like) {
    const { profileId } = like;
    return this.likeService.populateProfile(profileId);
  }

  // @ResolveField()
  // async user(@Parent() like: Like) {
  //   const { commentId } = like;
  //   return this.likeService.populateComment(commentId);
  // }
}
// @Mutation(() => Like)
// updateLike(@Args('updateLikeInput') updateLikeInput: UpdateLikeInput) {
//   return this.likeService.update(updateLikeInput.id, updateLikeInput);
// }

// @Mutation(() => Like)
// removeLike(@Args('id', { type: () => Int }) id: number) {
//   return this.likeService.remove(id);
// }
