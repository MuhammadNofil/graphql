import { Resolver, Query, Mutation, Args, Int, ResolveField, Parent } from '@nestjs/graphql';
import { GroupsService } from './groups.service';
import { Group, PaginatedGroup } from './entities/group.entity';
import { CreateGroupInput } from './dto/create-group.input';
import { UpdateGroupInput } from './dto/update-group.input';
import { GqlAuthGuard } from 'src/shared/guards/gql-authguard';
import { UseGuards } from '@nestjs/common';
import { FindManyFollowDto } from '../user/profile/follow/dto/find-many-follow.dto';
import { FindManyGrouptDto } from './dto/find-many-group.dto';
import { FindManyNftDto } from '../nft/dto/find-many-nfts.dto';
// import { FindManyGrouptDto } from './dto/Find-manygourp.input';

@Resolver(() => Group)
export class GroupsResolver {
  constructor(private readonly groupsService: GroupsService) {}

  @UseGuards(GqlAuthGuard)
  @Mutation(() => Group)
  createGroup(@Args('createGroupInput') createGroupInput: CreateGroupInput) {
    return this.groupsService.create(createGroupInput);
  }

  @UseGuards(GqlAuthGuard)
  @Query(() => PaginatedGroup)
  findMyGroups(@Args('findManyGroupInput') findManyGroupDto: FindManyGrouptDto) {
    return this.groupsService.findMyGroups(findManyGroupDto);
  }
  @UseGuards(GqlAuthGuard)
  @Query(() => Group)
  findOneGroup(@Args('id') id: string) {
    return this.groupsService.findOneGroup(id);
  }

  @UseGuards(GqlAuthGuard)
  @Mutation(() => Group)
  updateGroup(@Args('updateGroupInput') updateGroupInput: UpdateGroupInput) {
    return this.groupsService.update(updateGroupInput);
  }

  @UseGuards(GqlAuthGuard)
  @Query(() => PaginatedGroup)
  findAllGroups(@Args('findManyGrouptDto') findManyGrouptDto: FindManyGrouptDto) {
    return this.groupsService.FindAllGroup(findManyGrouptDto);
  }

  @ResolveField()
  async groupPost(@Parent() group: Group) {
    const { id } = group;
    return this.groupsService.populateGroupPost(id);
  }

  @ResolveField()
  async PostCount(@Parent() group: Group) {
    const { id } = group;
    return this.groupsService.postCount(id);
  }

  @ResolveField()
  async profile(@Parent() group: Group) {
    const { ownerProfileId } = group;
    return this.groupsService.populteOwnerProfile(ownerProfileId);
  }

  @ResolveField()
  async memberCount(@Parent() group: Group) {
    const { id } = group;
    return this.groupsService.countGroupMembers(id);
  }

  // @Mutation(() => Group)
  // removeGroup(@Args('id', { type: () => Int }) id: number) {
  //   return this.groupsService.remove(id);
  // }
}
