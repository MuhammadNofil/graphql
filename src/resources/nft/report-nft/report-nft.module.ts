import { Module } from '@nestjs/common';
import { ReportNftService } from './report-nft.service';
import { ReportNftResolver } from './report-nft.resolver';
import { SharedModule } from 'src/shared/shared.module';

@Module({
  imports: [SharedModule],
  providers: [ReportNftResolver, ReportNftService],
  exports: [ReportNftService],
})
export class ReportNftModule {}
