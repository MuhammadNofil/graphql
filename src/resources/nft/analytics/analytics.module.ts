import { Module } from '@nestjs/common';
import { SharedModule } from 'src/shared/shared.module';
import { NftImpressionModule } from './nft-impression/nft-impression.module';
import { NftImpressionService } from './nft-impression/nft-impression.service';
import { NftViewModule } from './nft-view/nft-view.module';
import { NftViewService } from './nft-view/nft-view.service';

@Module({
  imports: [NftImpressionModule, NftViewModule, SharedModule],
})
export class AnalyticsModule {}
