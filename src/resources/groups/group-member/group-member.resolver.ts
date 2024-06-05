import { Resolver, Query, Mutation, Args, Int } from '@nestjs/graphql';
import { GroupMemberService } from './group-member.service';
import { GroupMember } from './entities/group-member.entity';
import { CreateGroupMemberInput } from './dto/create-group-member.input';
import { UpdateGroupMemberInput } from './dto/update-group-member.input';
import { GqlAuthGuard } from 'src/shared/guards/gql-authguard';
import { UseGuards } from '@nestjs/common';
import { MessageEntity } from 'src/common/message.entity';
import { GroupInviteService } from '../group-invite/group-invite.service';
import { AcceptRejectGroupInviteInput } from '../group-invite/dto/accept-group-invite.input';

@Resolver(() => GroupMember)
export class GroupMemberResolver {
  constructor(private readonly groupMemberService: GroupMemberService) {}

  @UseGuards(GqlAuthGuard)
  @Query(() => MessageEntity)
  leaveGroup(@Args('id', { type: () => String }) id: string) {
    return this.groupMemberService.leave(id);
  }
  @UseGuards(GqlAuthGuard)
  @Query(() => GroupMember)
  notification_inviteAccepted(@Args('id', { type: () => String }) id: string) {
    return this.groupMemberService.notification_inviteAccepted(id);
  }

  @UseGuards(GqlAuthGuard)
  @Mutation(() => MessageEntity)
  groupInvite_accept_byId(
    @Args('acceptRejectGroupInviteInput') acceptRejectGroupInviteInput: AcceptRejectGroupInviteInput,
  ) {
    return this.groupMemberService.groupInviteAcceptById(acceptRejectGroupInviteInput);
  }
}
