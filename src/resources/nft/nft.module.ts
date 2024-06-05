import { Module } from '@nestjs/common';
import { NftService } from './nft.service';
import { NftResolver } from './nft.resolver';
import { SharedModule } from 'src/shared/shared.module';
import { CommentModule } from './comment/comment.module';
import { LikeModule } from './like/like.module';
import { RateNftModule } from './rate-nft/rate-nft.module';
import { ReportNftModule } from './report-nft/report-nft.module';
import { AnalyticsModule } from './analytics/analytics.module';
import { NftViewModule } from './analytics/nft-view/nft-view.module';
import { NftImpressionModule } from './analytics/nft-impression/nft-impression.module';
import { NftController } from './nft.controller';

@Module({
  imports: [SharedModule, CommentModule, LikeModule, RateNftModule, ReportNftModule, AnalyticsModule, NftViewModule, NftImpressionModule],
  providers: [NftResolver, NftService],
  exports: [NftService],
  controllers: [NftController],
})
export class NftModule { }
