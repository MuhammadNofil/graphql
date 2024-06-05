import { Module } from '@nestjs/common';
import { RateNftService } from './rate-nft.service';
import { RateNftResolver } from './rate-nft.resolver';
import { SharedModule } from 'src/shared/shared.module';

@Module({
  imports: [SharedModule],
  providers: [RateNftResolver, RateNftService],
  exports: [RateNftService],
})
export class RateNftModule {}
