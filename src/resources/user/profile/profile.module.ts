import { Module } from '@nestjs/common';
import { ProfileService } from './profile.service';
import { ProfileResolver } from './profile.resolver';
import { SharedModule } from 'src/shared/shared.module';
import { SocialProfileModule } from './social-profile/social-profile.module';
import { FollowModule } from './follow/follow.module';
import { BlockProfileModule } from './block-profile/block-profile.module';
import { ReportProfileModule } from './report-profile/report-profile.module';
import { GroupsModule } from 'src/resources/groups/groups.module';
import { FeedbackModule } from './feedback/feedback.module';
import { ProfileActivityModule } from './profile-activity/profile-activity.module';
import { PurchaseModule } from './purchase/purchase.module';

@Module({
  imports: [SharedModule, SocialProfileModule, FollowModule, BlockProfileModule, ReportProfileModule,GroupsModule, FeedbackModule, ProfileActivityModule, PurchaseModule],
  providers: [ProfileResolver, ProfileService],
  exports: [ProfileService],
})
export class ProfileModule {}
