import { Resolver, Query, Mutation, Args, Int, ResolveField, Parent } from '@nestjs/graphql';
import { ProfileService } from './profile.service';
import { PaginatedProfile, Profile } from './entities/profile.entity';
import { CreateProfileInput } from './dto/create-profile.input';
import { UpdateProfileInput } from './dto/update-profile.input';
import { UseGuards } from '@nestjs/common';
import { GqlAuthGuard } from 'src/shared/guards/gql-authguard';
import { SocialProfileService } from './social-profile/social-profile.service';
import { Interests } from './entities/interests.entity';
import { MessageEntity } from 'src/common/message.entity';
import { PaginationDto } from 'src/common/pagination.dto';

@Resolver(() => Profile)
export class ProfileResolver {
  constructor(
    private readonly profileService: ProfileService,
    private readonly socialProfileService: SocialProfileService,
  ) {}

  // @Mutation(() => Profile)
  // createProfile(@Args('createProfileInput') createProfileInput: CreateProfileInput) {
  //   return this.profileService.create(createProfileInput);
  // }

  // @Query(() => [Profile], { name: 'profile' })
  // findAll() {
  //   return this.profileService.findAll();
  // }

  @UseGuards(GqlAuthGuard)
  @Query(() => Profile)
  findOneProfile(@Args('id') id: string) {
    return this.profileService.findOne(id);
  }

  @UseGuards(GqlAuthGuard)
  @Query(() => Profile, { name: 'myProfile' })
  myProfile() {
    return this.profileService.myProfile();
  }

  @UseGuards(GqlAuthGuard)
  @Query(() => [Interests])
  getAllInterest() {
    return this.profileService.getAllInterests();
  }

  @UseGuards(GqlAuthGuard)
  @Mutation(() => Profile)
  updateProfile(@Args('updateProfileInput') updateProfileInput: UpdateProfileInput) {
    return this.profileService.update(updateProfileInput);
  }

  @Mutation(() => MessageEntity)
  markedVerified(@Args('profileId') profileId: string) {
    return this.profileService.markedVerifed(profileId);
  }

  @UseGuards(GqlAuthGuard)
  @Query(() => PaginatedProfile)
  featuredProfile(@Args('pagination') pagination: PaginationDto) {
    return this.profileService.featuredProfile(pagination);
  }

  @UseGuards(GqlAuthGuard)
  @Query(() => PaginatedProfile)
  popularProfiles(@Args('pagination') pagination: PaginationDto) {
    return this.profileService.topRatedProfiles(pagination);
  }

  // @Query(() => [Profile])
  // mostPopularProfiles() {
  //   return this.profileService.mostPopularProfiles()
  // }

  // @Mutation(() => Profile)
  // removeProfile(@Args('id', { type: () => Int }) id: number) {
  //   return this.profileService.remove(id);
  // }

  @ResolveField()
  async user(@Parent() profile: Profile) {
    const { userId } = profile;
    return this.profileService.populateUser(userId);
  }

  // @ResolveField()
  // async group(@Parent() profile: Profile) {
  //   const { id } = profile;
  //   return this.groupService.findAllGroups(id);
  // }

  @ResolveField()
  async socialProfile(@Parent() profile: Profile) {
    const { id } = profile;
    return this.socialProfileService.findAll(id);
  }

  @ResolveField()
  async nftImpression(@Parent() profile: Profile) {
    const { id } = profile;
    return this.profileService.populateNftImpression(id);
  }

  @ResolveField()
  async nftView(@Parent() profile: Profile) {
    const { id } = profile;
    return this.profileService.populateNftView(id);
  }

  @ResolveField()
  async groupPost(@Parent() profile: Profile) {
    const { id } = profile;
    return this.profileService.populateGroupPost(id);
  }

  @ResolveField()
  async group(@Parent() profile: Profile) {
    const { id } = profile;
    return this.profileService.populateGroups(id);
  }

  @ResolveField()
  async comment(@Parent() profile: Profile) {
    const { id } = profile;
    return this.profileService.populateComments(id);
  }

  @ResolveField()
  async rateNft(@Parent() profile: Profile) {
    const { id } = profile;
    return this.profileService.populateRateNft(id);
  }

  @ResolveField()
  async likesCount(@Parent() profile: Profile) {
    const { id } = profile;
    return this.profileService.likesCount(id);
  }

  @ResolveField()
  async followedCount(@Parent() profile: Profile) {
    const { id } = profile;
    return this.profileService.followedCount(id);
  }

  @ResolveField()
  async followersCount(@Parent() profile: Profile) {
    const { id } = profile;
    return this.profileService.followersCount(id);
  }

  @ResolveField()
  async isFollowed(@Parent() profile: Profile) {
    const { id } = profile;
    return this.profileService.isFollowedFlag(id);
  }

  @ResolveField()
  async badges(@Parent() profile: Profile) {
    const { points } = profile;
    return this.profileService.populateBadge(points);
  }

  @ResolveField()
  async nft(@Parent() profile: Profile) {
    const { id } = profile;
    return this.profileService.populateNft(id);
  }
}
