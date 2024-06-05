import { Module } from '@nestjs/common';
import { CommentService } from './comment.service';
import { CommentResolver } from './comment.resolver';
import { SharedModule } from 'src/shared/shared.module';
import { CommentLikeModule } from './comment-like/comment-like.module';
import { CommentRepliesModule } from './comment-replies/comment-replies.module';

@Module({
  imports: [SharedModule, CommentLikeModule, CommentRepliesModule],
  providers: [CommentResolver, CommentService],
  exports: [CommentService],
})
export class CommentModule {}
