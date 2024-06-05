import { Module } from '@nestjs/common';
import { ProfileActivityService } from './profile-activity.service';
import { ProfileActivityResolver } from './profile-activity.resolver';
import { LikeModule } from 'src/resources/nft/like/like.module';
import { CommentModule } from 'src/resources/nft/comment/comment.module';
import { RateNftModule } from 'src/resources/nft/rate-nft/rate-nft.module';
import { SharedModule } from 'src/shared/shared.module';

@Module({
  imports: [ LikeModule,CommentModule,RateNftModule,SharedModule],
  providers: [ProfileActivityResolver,ProfileActivityService],
  exports: [ProfileActivityService]
})
export class ProfileActivityModule {}
