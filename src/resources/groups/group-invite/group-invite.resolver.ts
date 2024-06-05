import { Resolver, Query, Mutation, Args, Int } from '@nestjs/graphql';
import { GroupInviteService } from './group-invite.service';
import { GroupInvite } from './entities/group-invite.entity';
import { CreateGroupInviteInput } from './dto/create-group-invite.input';
import { UpdateGroupInviteInput } from './dto/update-group-invite.input';
import { GqlAuthGuard } from 'src/shared/guards/gql-authguard';
import { UseGuards } from '@nestjs/common';
import { GroupMember } from '../group-member/entities/group-member.entity';

@Resolver(() => GroupInvite)
export class GroupInviteResolver {
  constructor(private readonly groupInviteService: GroupInviteService) { }

  @UseGuards(GqlAuthGuard)
  @Mutation(() => GroupInvite)
  createGroupInvite(@Args('createGroupInviteInput') createGroupInviteInput: CreateGroupInviteInput) {
    return this.groupInviteService.invite(createGroupInviteInput);
  }

  @UseGuards(GqlAuthGuard)
  @Mutation(() => GroupInvite)
  sendGroupInvite(@Args('createGroupInviteInput') createGroupInviteInput: CreateGroupInviteInput) {
    return this.groupInviteService.sendGroupInvite(createGroupInviteInput);
  }

  @Mutation(() => String)
  shareGroup(@Args('groupId') groupId: string) {
    return this.groupInviteService.shareGroup(groupId);
  }
  // @Query(() => [GroupInvite], { name: 'groupInvite' })
  // findAll() {
  //   return this.groupInviteService.findAll();
  // }

  @UseGuards(GqlAuthGuard)
  @Query(() => GroupInvite)
  notification_invite(@Args('id', { type: () => String }) id: string) {
    return this.groupInviteService.notification_Invite(id);
  }

  @UseGuards(GqlAuthGuard)
  @Query(() => GroupInvite)
  InviteGroupWhenSignedIn(@Args('signature', { type: () => String }) signature: string) {
    return this.groupInviteService.InviteGroupWhenSignedIn(signature);
  }

  // @Mutation(() => GroupInvite)
  // updateGroupInvite(@Args('updateGroupInviteInput') updateGroupInviteInput: UpdateGroupInviteInput) {
  //   return this.groupInviteService.update(updateGroupInviteInput.id, updateGroupInviteInput);
  // }

  // @Mutation(() => GroupInvite)
  // removeGroupInvite(@Args('id', { type: () => Int }) id: number) {
  //   return this.groupInviteService.remove(id);
  // }
}
