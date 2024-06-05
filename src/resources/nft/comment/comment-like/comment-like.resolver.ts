import { Resolver, Query, Mutation, Args, Int, ResolveField, Parent } from '@nestjs/graphql';
import { CommentLikeService } from './comment-like.service';
import { CommentLike } from './entities/comment-like.entity';
import { CreateCommentLikeInput } from './dto/create-comment-like.input';
import { UpdateCommentLikeInput } from './dto/update-comment-like.input';
import { UseGuards } from '@nestjs/common';
import { GqlAuthGuard } from 'src/shared/guards/gql-authguard';

@Resolver(() => CommentLike)
export class CommentLikeResolver {
  constructor(private readonly commentLikeService: CommentLikeService) {}

  @UseGuards(GqlAuthGuard)
  @Mutation(() => CommentLike)
  createCommentLike(@Args('createCommentLikeInput') createCommentLikeInput: CreateCommentLikeInput) {
    return this.commentLikeService.create(createCommentLikeInput);
  }

  @UseGuards(GqlAuthGuard)
  @Query(() => CommentLike)
  notification_commentLike(@Args('id', { type: () => String }) id: string) {
    return this.commentLikeService.notification_commentLike(id);
  }

  @UseGuards(GqlAuthGuard)
  @Query(() => [CommentLike])
  findAllCommentLikes(@Args('commentId', { type: () => String }) commentId: string) {
    console.log({ commentId });
    return this.commentLikeService.findAllCommentLikes(commentId);
  }

  @ResolveField()
  async comment(@Parent() commentLike: CommentLike) {
    const { commentId } = commentLike;
    return this.commentLikeService.populateComment(commentId);
  }

  @ResolveField()
  async profile(@Parent() CommentLike: CommentLike) {
    const { profileId } = CommentLike;
    return this.commentLikeService.populateProfile(profileId);
  }
}
