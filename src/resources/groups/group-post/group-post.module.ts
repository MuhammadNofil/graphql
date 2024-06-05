import { Module } from '@nestjs/common';
import { SharedModule } from 'src/shared/shared.module';
import { GroupPostResolver } from './group-post.resolver';
import { GroupPostService } from './group-post.service';

@Module({
  imports: [SharedModule],
  providers: [GroupPostResolver, GroupPostService],
exports:[GroupPostService]
})
export class GrouppostModule {}
