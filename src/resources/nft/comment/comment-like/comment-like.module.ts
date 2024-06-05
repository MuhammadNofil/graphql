import { Module } from '@nestjs/common';
import { CommentLikeService } from './comment-like.service';
import { CommentLikeResolver } from './comment-like.resolver';
import { SharedModule } from 'src/shared/shared.module';

@Module({
  imports: [SharedModule],
  providers: [CommentLikeResolver, CommentLikeService],
  exports: [CommentLikeService],
})
export class CommentLikeModule {}
