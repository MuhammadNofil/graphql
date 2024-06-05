import { Module } from '@nestjs/common';
import { ReportProfileService } from './report-profile.service';
import { ReportProfileResolver } from './report-profile.resolver';
import { SharedModule } from 'src/shared/shared.module';

@Module({
  imports: [SharedModule],
  providers: [ReportProfileResolver, ReportProfileService],
  exports: [ReportProfileService],
})
export class ReportProfileModule {}
