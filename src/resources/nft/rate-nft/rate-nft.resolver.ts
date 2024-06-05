import { Resolver, Query, Mutation, Args, Int, ResolveField, Parent } from '@nestjs/graphql';
import { RateNftService } from './rate-nft.service';
import { RateNft } from './entities/rate-nft.entity';
import { CreateRateNftInput } from './dto/create-rate-nft.input';
import { UpdateRateNftInput } from './dto/update-rate-nft.input';
import { FindManyRateNftDto } from './dto/find-many-rate-nfts.dto';
import { UseGuards } from '@nestjs/common';
import { GqlAuthGuard } from 'src/shared/guards/gql-authguard';

@Resolver(() => RateNft)
export class RateNftResolver {
  constructor(private readonly rateNftService: RateNftService) { }

  @UseGuards(GqlAuthGuard)
  @Mutation(() => RateNft)
  createRateNft(@Args('createRateNftInput') createRateNftInput: CreateRateNftInput) {
    return this.rateNftService.create(createRateNftInput);
  }

  @UseGuards(GqlAuthGuard)
  @Query(() => [RateNft], { name: 'rateNft' })
  findAll(@Args('findManyRateNftDto') findManyRateNftDto: FindManyRateNftDto) {
    return this.rateNftService.findAll(findManyRateNftDto);
  }

  @UseGuards(GqlAuthGuard)
  @Query(() => Number)
  countSameDayRate() {
    return this.rateNftService.ratedNFTcount();
  }

  @UseGuards(GqlAuthGuard)
  @Query(() => RateNft)
  notification_rate(@Args('id') id: string) {
    return this.rateNftService.notification_Rate(id);
  }

  // @Mutation(() => RateNft)
  // updateRateNft(@Args('updateRateNftInput') updateRateNftInput: UpdateRateNftInput) {
  //   return this.rateNftService.update(updateRateNftInput.id, updateRateNftInput);
  // }

  // @Mutation(() => RateNft)
  // removeRateNft(@Args('id', { type: () => Int }) id: number) {
  //   return this.rateNftService.remove(id);
  // }

  @ResolveField()
  async nft(@Parent() rateNft: RateNft) {
    const { nftId } = rateNft;
    return this.rateNftService.populateNft(nftId);
  }

  @ResolveField()
  async profile(@Parent() rateNft: RateNft) {
    const { profileId } = rateNft;
    return this.rateNftService.populateProfile(profileId);
  }
}
