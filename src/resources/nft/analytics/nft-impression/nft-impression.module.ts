import { Module } from '@nestjs/common';
import { NftImpressionService } from './nft-impression.service';
import { NftImpressionResolver } from './nft-impression.resolver';
import { SharedModule } from 'src/shared/shared.module';

@Module({
  imports: [SharedModule],
  providers: [NftImpressionResolver, NftImpressionService],
  exports: [NftImpressionService],
})
export class NftImpressionModule {}
