import { Module } from '@nestjs/common';
import { BlockProfileService } from './block-profile.service';
import { BlockProfileResolver } from './block-profile.resolver';
import { SharedModule } from 'src/shared/shared.module';

@Module({
  imports: [SharedModule],
  providers: [BlockProfileResolver, BlockProfileService],
  exports: [BlockProfileService],
})
export class BlockProfileModule {}
