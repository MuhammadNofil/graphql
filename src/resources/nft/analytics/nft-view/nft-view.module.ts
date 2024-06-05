import { Module } from '@nestjs/common';
import { NftViewService } from './nft-view.service';
import { NftViewResolver } from './nft-view.resolver';
import { SharedModule } from 'src/shared/shared.module';

@Module({
  imports: [SharedModule],
  providers: [NftViewResolver, NftViewService],
  exports: [NftViewService],
})
export class NftViewModule {}
