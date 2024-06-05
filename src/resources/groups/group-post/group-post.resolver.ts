import { Resolver, Query, Mutation, Args, Int, ResolveField, Parent } from '@nestjs/graphql';
import { GroupPostService } from './group-post.service';
import { GroupPost, PaginatedGroupPost } from './entities/group-post.entity';
import { CreateGrouppostInput } from './dto/create-group-post.input';
import { UpdateGrouppostInput } from './dto/update-group-post.input';
import { UseGuards } from '@nestjs/common';
import { GqlAuthGuard } from 'src/shared/guards/gql-authguard';
import { FindManyGroupPostDto } from './dto/filter-many-group-post.input';
import { MessageEntity } from 'src/common/message.entity';

@Resolver(() => GroupPost)
export class GroupPostResolver {
  constructor(private readonly grouppostService: GroupPostService) {}
  //tested
  @UseGuards(GqlAuthGuard)
  @Mutation(() => GroupPost)
  createGrouppost(@Args('createGrouppostInput') createGrouppostInput: CreateGrouppostInput) {
    return this.grouppostService.create(createGrouppostInput);
  }

  @UseGuards(GqlAuthGuard)
  @Query(() => PaginatedGroupPost)
  findAllGroupPost(@Args('findManyGroupPostDto') findManyGroupPostDto: FindManyGroupPostDto) {
    return this.grouppostService.findAllGroupPost(findManyGroupPostDto);
  }

  @UseGuards(GqlAuthGuard)
  @Query(() => GroupPost)
  findOneGroupPost(@Args('id', { type: () => String }) id: string) {
    return this.grouppostService.findOneGroupPost(id);
  }

  @UseGuards(GqlAuthGuard)
  @Mutation(() => GroupPost)
  updateGrouppost(@Args('updateGrouppostInput') updateGrouppostInput: UpdateGrouppostInput) {
    return this.grouppostService.update(updateGrouppostInput);
  }

  @UseGuards(GqlAuthGuard)
  @Mutation(() => MessageEntity)
  removeGrouppost(@Args('id', { type: () => String }) id: string) {
    return this.grouppostService.removeGroupPost(id);
  }

  @ResolveField()
  async nft(@Parent() groupPost: GroupPost) {
    const { nftId } = groupPost;
    console.log('🚀 ~ file: group-post.resolver.ts:48 ~ GroupPostResolver ~ nft ~ nftId', nftId);
    return this.grouppostService.populateNft(nftId);
  }

  @ResolveField()
  async profile(@Parent() groupPost: GroupPost) {
    const { profileId } = groupPost;
    return this.grouppostService.populateProfile(profileId);
  }

  @ResolveField()
  async group(@Parent() groupPost: GroupPost) {
    const { groupId } = groupPost;
    return this.grouppostService.populateGroup(groupId);
  }
}
