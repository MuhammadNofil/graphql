import { Resolver, Query, Mutation, Args, Int, ResolveField, Parent } from '@nestjs/graphql';
import { BlockProfileService } from './block-profile.service';
import { BlockProfile } from './entities/block-profile.entity';
import { CreateBlockProfileInput } from './dto/create-block-profile.input';
import { UnBlockProfileInput } from './dto/update-block-profile.input';
import { GqlAuthGuard } from 'src/shared/guards/gql-authguard';
import { UseGuards } from '@nestjs/common';
import { MessageEntity } from 'src/common/message.entity';

@Resolver(() => BlockProfile)
export class BlockProfileResolver {
  constructor(private readonly blockProfileService: BlockProfileService) {}

  @UseGuards(GqlAuthGuard)
  @Mutation(() => BlockProfile)
  createBlockProfile(@Args('createBlockProfileInput') createBlockProfileInput: CreateBlockProfileInput) {
    return this.blockProfileService.block(createBlockProfileInput);
  }

  @UseGuards(GqlAuthGuard)
  @Query(() => [BlockProfile])
  findAllBlockProfile() {
    return this.blockProfileService.findAll();
  }

  @UseGuards(GqlAuthGuard)
  @Query(() => BlockProfile)
  findOneBlockProfile(@Args('id', { type: () => String }) id: string) {
    return this.blockProfileService.findOne(id);
  }

  @UseGuards(GqlAuthGuard)
  @Mutation(() => MessageEntity)
  updateBlockProfile(@Args('unBlockProfileInput') unBlockProfileInput: UnBlockProfileInput) {
    return this.blockProfileService.unblock(unBlockProfileInput);
  }

  @UseGuards(GqlAuthGuard)
  @ResolveField()
  async profile(@Parent() blockProfile: BlockProfile) {
    const { profileId } = blockProfile;
    return this.blockProfileService.populateProfile(profileId);
  }

  @ResolveField()
  async blockedProfile(@Parent() blockProfile: BlockProfile) {
    const { blockedProfileId } = blockProfile;
    return this.blockProfileService.populateProfile(blockedProfileId);
  }

  @Mutation(() => BlockProfile)
  removeBlockProfile(@Args('id', { type: () => Int }) id: number) {
    return this.blockProfileService.remove(id);
  }
}
