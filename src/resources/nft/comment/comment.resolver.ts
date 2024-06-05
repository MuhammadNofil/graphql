import { Resolver, Query, Mutation, Args, Int, ResolveField, Parent, Subscription } from '@nestjs/graphql';
import { CommentService } from './comment.service';
import { Comment, PaginatedComment } from './entities/comment.entity';
import { CreateCommentInput } from './dto/create-comment.input';
import { UpdateCommentInput } from './dto/update-comment.input';
import { MessageEntity } from 'src/common/message.entity';
import { UseGuards } from '@nestjs/common';
import { GqlAuthGuard } from 'src/shared/guards/gql-authguard';
import { CommentRepliesService } from './comment-replies/comment-replies.service';
import { PubSub } from 'graphql-subscriptions';
import { FindPaginatedCommentDto } from './dto/find-paginatedComment.dto';

@Resolver(() => Comment)
export class CommentResolver {
  constructor(private readonly commentService: CommentService, private readonly pubSub: PubSub) { }

  @UseGuards(GqlAuthGuard)
  @Mutation(() => Comment)
  createComment(@Args('createCommentInput') createCommentInput: CreateCommentInput) {
    return this.commentService.create(createCommentInput);
  }

  @UseGuards(GqlAuthGuard)
  @Mutation(() => Comment)
  updateComment(@Args('updateCommentInput') updateCommentInput: UpdateCommentInput) {
    return this.commentService.update(updateCommentInput);
  }

  @UseGuards(GqlAuthGuard)
  @Query(() => Comment)
  notification_comment(@Args('id', { type: () => String }) id: string) {
    return this.commentService.notification_Comment(id);
  }

  @UseGuards(GqlAuthGuard)
  @Query(() => Comment)
  findOneComment(@Args('id', { type: () => String }) id: string) {
    return this.commentService.findOne(id);
  }

  @UseGuards(GqlAuthGuard)
  @Query(() => PaginatedComment)
  paginatedComment(@Args('findPaginatedCommentDto') findPaginatedCommentDto: FindPaginatedCommentDto) {
    return this.commentService.paginatedCommmnt(findPaginatedCommentDto);
  }


  @ResolveField()
  async profile(@Parent() comment: Comment) {
    const { profileId } = comment;
    return this.commentService.populateProfile(profileId);
  }

  @ResolveField()
  async nft(@Parent() comment: Comment) {
    const { nftId } = comment;
    return this.commentService.populateNft(nftId);
  }

  @UseGuards(GqlAuthGuard)
  @Mutation(() => MessageEntity)
  removeComment(@Args('id', { type: () => String }) id: string) {
    return this.commentService.remove(id);
  }

  @ResolveField()
  async commentReply(@Parent() comment: Comment) {
    const { id } = comment;
    return this.commentService.populateCommentReplies(id);
  }

  @ResolveField()
  async repliesCount(@Parent() comment: Comment) {
    const { id } = comment;
    return this.commentService.repliesCount(id);
  }

  @ResolveField()
  async commentLike(@Parent() comment: Comment) {
    const { id } = comment;
    return this.commentService.populateCommentLikes(id);
  }

  @ResolveField()
  async commentLikesCount(@Parent() comment: Comment) {
    const { id } = comment;
    return this.commentService.commentLikesCount(id);
  }

  @ResolveField()
  async isLikedFlag(@Parent() comment: Comment) {
    const { id } = comment;
    return this.commentService.isLikedFlag(id);
  }


  @ResolveField()
  async commentCount(@Parent() comment: Comment) {
    const { nftId } = comment;
    return this.commentService.commentCount(nftId);
  }






}
