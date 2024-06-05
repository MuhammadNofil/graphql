import { Module } from '@nestjs/common';
import { GroupMemberService } from './group-member.service';
import { GroupMemberResolver } from './group-member.resolver';
import { SharedModule } from 'src/shared/shared.module';
import { GroupsModule } from '../groups.module';

@Module({
  imports: [SharedModule],
  providers: [GroupMemberResolver, GroupMemberService,],
  exports: [GroupMemberService]
})
export class GroupMemberModule { }
