import { Resolver, Query, Mutation, Args, Int, ResolveField, Parent } from '@nestjs/graphql';
import { CommentRepliesService } from './comment-replies.service';
import { CommentReply } from './entities/comment-reply.entity';
import { CreateCommentReplyInput } from './dto/create-comment-reply.input';
import { UpdateCommentReplyInput } from './dto/update-comment-reply.input';
import { GqlAuthGuard } from 'src/shared/guards/gql-authguard';
import { UseGuards } from '@nestjs/common';
import { Commentreply } from '@prisma/client';
import { MessageEntity } from 'src/common/message.entity';

@Resolver(() => CommentReply)
export class CommentRepliesResolver {
  constructor(private readonly commentRepliesService: CommentRepliesService) { }

  @UseGuards(GqlAuthGuard)
  @Mutation(() => CommentReply)
  createCommentReply(@Args('createCommentReplyInput') createCommentReplyInput: CreateCommentReplyInput) {
    return this.commentRepliesService.create(createCommentReplyInput);
  }

  @UseGuards(GqlAuthGuard)
  @Query(() => CommentReply)
  notification_commentReply(@Args('id', { type: () => String }) id: string) {
    return this.commentRepliesService.notification_commentReply(id);
  }

  @UseGuards(GqlAuthGuard)
  @Query(() => [CommentReply])
  findAllCommentReplies(@Args('commentId') commentId: string) {
    return this.commentRepliesService.findAllCommentReplies(commentId);
  }

  @UseGuards(GqlAuthGuard)
  @Query(() => [CommentReply], { name: 'commentReplies' })
  findAll() {
    return this.commentRepliesService.findAll();
  }

  @UseGuards(GqlAuthGuard)
  @Mutation(() => CommentReply)
  updateCommentReply(@Args('updateCommentReplyInput') updateCommentReplyInput: UpdateCommentReplyInput) {
    return this.commentRepliesService.update(updateCommentReplyInput);
  }

  @UseGuards(GqlAuthGuard)
  @Mutation(() => MessageEntity)
  removeCommentReply(@Args('id') id: string) {
    return this.commentRepliesService.remove(id);
  }

  @ResolveField()
  async comment(@Parent() commentreply: Commentreply) {
    const { commentId } = commentreply;
    return this.commentRepliesService.populateComment(commentId);
  }

  @ResolveField()
  async profile(@Parent() commentreply: Commentreply) {
    const { profileId } = commentreply;
    return this.commentRepliesService.populateProfile(profileId);
  }

  // @Query(() => CommentReply, { name: 'commentReply' })
  // findOne(@Args('id', { type: () => Int }) id: number) {
  //   return this.commentRepliesService.findOne(id);
  // }
}
