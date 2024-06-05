import { Resolver, Query, Mutation, Args, Int, ResolveField, Parent } from '@nestjs/graphql';
import { NftImpressionService } from './nft-impression.service';
import { NftImpression, PaginatedNftImpression } from './entities/nft-impression.entity';
import { CreateNftImpressionInput } from './dto/create-nft-impression.input';
import { UpdateNftImpressionInput } from './dto/update-nft-impression.input';
import { FindManyNftImpressionDto } from './dto/find-many-nfts.dto';

@Resolver(() => NftImpression)
export class NftImpressionResolver {
  constructor(private readonly nftImpressionService: NftImpressionService) {}

  @Mutation(() => NftImpression)
  createNftImpression(@Args('createNftImpressionInput') createNftImpressionInput: CreateNftImpressionInput) {
    return this.nftImpressionService.create(createNftImpressionInput);
  }

  @Query(() => PaginatedNftImpression, { name: 'nftImpression' })
  findAll(@Args('findManyNftImpressionDto') findManyNftImpressionDto: FindManyNftImpressionDto) {
    return this.nftImpressionService.findAll(findManyNftImpressionDto);
  }

  @Query(() => NftImpression, { name: 'nftImpression' })
  findOne(@Args('id', { type: () => Int }) id: number) {
    return this.nftImpressionService.findOne(id);
  }

  @Mutation(() => NftImpression)
  updateNftImpression(@Args('updateNftImpressionInput') updateNftImpressionInput: UpdateNftImpressionInput) {
    return this.nftImpressionService.update(updateNftImpressionInput.id, updateNftImpressionInput);
  }

  @Mutation(() => NftImpression)
  removeNftImpression(@Args('id', { type: () => Int }) id: number) {
    return this.nftImpressionService.remove(id);
  }

  @ResolveField()
  async nft(@Parent() nftImpression: NftImpression) {
    const { nftId } = nftImpression;
    return this.nftImpressionService.populateNft(nftId);
  }

  @ResolveField()
  async profile(@Parent() nftImpression: NftImpression) {
    const { profileId } = nftImpression;
    return this.nftImpressionService.populateProfile(profileId);
  }
}
