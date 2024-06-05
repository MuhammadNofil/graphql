import { Module } from '@nestjs/common';
import { SocialProfileService } from './social-profile.service';
import { SocialProfileResolver } from './social-profile.resolver';
import { SharedModule } from 'src/shared/shared.module';
import { ProfileService } from '../profile.service';

@Module({
  imports: [SharedModule],
  providers: [SocialProfileResolver, SocialProfileService],
  exports: [SocialProfileService],
})
export class SocialProfileModule {}
