import { Resolver, Query, Mutation, Args, Int, Parent, ResolveField } from '@nestjs/graphql';
import { FollowService } from './follow.service';
import { Follow, PaginatedFollow } from './entities/follow.entity';
import { CreateFollowInput } from './dto/create-follow.input';
import { UpdateFollowInput } from './dto/update-follow.input';
import { FindManyFollowDto } from './dto/find-many-follow.dto';
import { UseGuards } from '@nestjs/common';
import { GqlAuthGuard } from 'src/shared/guards/gql-authguard';
import { MessageEntity } from 'src/common/message.entity';

@Resolver(() => Follow)
export class FollowResolver {
  constructor(private readonly followService: FollowService) {}

  @UseGuards(GqlAuthGuard)
  @Mutation(() => Follow)
  createFollow(@Args('createFollowInput') createFollowInput: CreateFollowInput) {
    return this.followService.follow(createFollowInput);
  }

  @UseGuards(GqlAuthGuard)
  @Query(() => PaginatedFollow)
  findAllFollowing(@Args('findManyFollowDto') findManyFollowDto: FindManyFollowDto) {
    return this.followService.findAll(findManyFollowDto);
  }

  @UseGuards(GqlAuthGuard)
  @Query(() => PaginatedFollow)
  findAllFollower(@Args('findManyFollowDto') findManyFollowDto: FindManyFollowDto) {
    return this.followService.findAll(findManyFollowDto);
  }

  @UseGuards(GqlAuthGuard)
  @Query(() => Follow)
  notification_follow(@Args('id', { type: () => String }) id: string) {
    return this.followService.notification_follow(id);
  }

  @UseGuards(GqlAuthGuard)
  @Mutation(() => MessageEntity)
  updateFollow(@Args('updateFollowInput') updateFollowInput: UpdateFollowInput) {
    return this.followService.unfollow(updateFollowInput);
  }

  @ResolveField()
  async followedProfile(@Parent() follow: Follow) {
    const { followedProfileId: id } = follow;
    return this.followService.populateProfile(id);
  }

  @ResolveField()
  async followerProfile(@Parent() follow: Follow) {
    const { followerProfileId: id } = follow;
    return this.followService.populateProfile(id);
  }

  // @UseGuards(GqlAuthGuard)
  // @Mutation(() => Follow)
  // removeFollow(@Args('id', { type: () => Int }) id: number) {
  //   return this.followService.remove(id);
  // }
}
