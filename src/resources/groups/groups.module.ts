import { Module } from '@nestjs/common';
import { GroupsService } from './groups.service';
import { GroupsResolver } from './groups.resolver';
import { SharedModule } from 'src/shared/shared.module';
import { ReportGroupModule } from './report-group/report-group.module';
import { GroupMemberModule } from './group-member/group-member.module';
import { GrouppostModule } from './group-post/group-post.module';
import { GroupInviteModule } from './group-invite/group-invite.module';

@Module({
  imports: [SharedModule, ReportGroupModule, GroupMemberModule, GrouppostModule, GroupInviteModule],
  providers: [GroupsResolver, GroupsService],
  exports: [GroupsService],
})
export class GroupsModule {}
