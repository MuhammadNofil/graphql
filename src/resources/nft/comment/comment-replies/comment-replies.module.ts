import { Module } from '@nestjs/common';
import { CommentRepliesService } from './comment-replies.service';
import { CommentRepliesResolver } from './comment-replies.resolver';
import { SharedModule } from 'src/shared/shared.module';

@Module({
  imports: [SharedModule],
  providers: [CommentRepliesResolver, CommentRepliesService],
  exports: [CommentRepliesService],
})
export class CommentRepliesModule {}
