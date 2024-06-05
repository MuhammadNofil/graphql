import { Module } from '@nestjs/common';
import { FeedbackService } from './feedback.service';
import { FeedbackResolver } from './feedback.resolver';
import { SharedModule } from 'src/shared/shared.module';

@Module({
  imports: [SharedModule],
  providers: [FeedbackResolver, FeedbackService],
  exports: [FeedbackService],
})
export class FeedbackModule {}
