import { Resolver, Query, Mutation, Args, Int, ResolveField, Parent } from '@nestjs/graphql';
import { SocialProfileService } from './social-profile.service';
import { SocialProfile } from './entities/social-profile.entity';
import { CreateSocialProfileInput } from './dto/create-social-profile.input';
import { UpdateSocialProfileInput } from './dto/update-social-profile.input';
import { GqlAuthGuard } from 'src/shared/guards/gql-authguard';
import { UseGuards } from '@nestjs/common';

@Resolver(() => SocialProfile)
export class SocialProfileResolver {
  constructor(private readonly socialProfileService: SocialProfileService) {}

  @UseGuards(GqlAuthGuard)
  @Mutation(() => SocialProfile)
  createSocialProfile(@Args('createSocialProfileInput') createSocialProfileInput: CreateSocialProfileInput) {
    console.log(
      '🚀 ~ file: social-profile.resolver.ts ~ line 16 ~ SocialProfileResolver ~ createSocialProfile ~ createSocialProfileInput',
      createSocialProfileInput,
    );
    return this.socialProfileService.create(createSocialProfileInput);
  }

  @UseGuards(GqlAuthGuard)
  @Query(() => [SocialProfile], { name: 'socialProfileAll' })
  findAll() {
    return this.socialProfileService.findAll();
  }

  @UseGuards(GqlAuthGuard)
  @Query(() => SocialProfile, { name: 'socialProfile' })
  findOne(@Args('id', { type: () => Int }) id: string) {
    return this.socialProfileService.findOne(id);
  }

  @UseGuards(GqlAuthGuard)
  @Mutation(() => SocialProfile)
  updateSocialProfile(@Args('updateSocialProfileInput') updateSocialProfileInput: UpdateSocialProfileInput) {
    return this.socialProfileService.update(updateSocialProfileInput);
  }

  @UseGuards(GqlAuthGuard)
  @Mutation(() => [SocialProfile])
  removeSocialProfile(@Args('id', { type: () => String }) id: string) {
    return this.socialProfileService.remove(id);
  }

  @UseGuards(GqlAuthGuard)
  @ResolveField()
  async profile(@Parent() socialProfile: SocialProfile) {
    const { profileId } = socialProfile;
    return this.socialProfileService.populateProfile(profileId);
  }
}
