import { Module } from '@nestjs/common';
import { ReportGroupService } from './report-group.service';
import { ReportGroupResolver } from './report-group.resolver';
import { SharedModule } from 'src/shared/shared.module';

@Module({
  imports: [SharedModule],
  providers: [ReportGroupResolver, ReportGroupService],
  exports: [ReportGroupService],
})
export class ReportGroupModule {}
