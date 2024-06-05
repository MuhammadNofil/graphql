import { Resolver, Query, Mutation, Args, Int, ResolveField, Parent } from '@nestjs/graphql';
import { NftViewService } from './nft-view.service';
import { NftView } from './entities/nft-view.entity';
import { CreateNftViewInput } from './dto/create-nft-view.input';
import { UpdateNftViewInput } from './dto/update-nft-view.input';
import { PaginatedNft } from '../../entities/nft.entity';
import { FindManyNftViewDto } from './dto/find-many-nfts.dto';

@Resolver(() => NftView)
export class NftViewResolver {
  constructor(private readonly nftViewService: NftViewService) {}

  @Mutation(() => NftView)
  createNftView(@Args('createNftViewInput') createNftViewInput: CreateNftViewInput) {
    return this.nftViewService.create(createNftViewInput);
  }

  @Query(() => PaginatedNft, { name: 'nftView' })
  findAll(@Args('findManyNftViewDto') findManyNftViewDto: FindManyNftViewDto) {
    return this.nftViewService.findAll(findManyNftViewDto);
  }

  @Query(() => NftView, { name: 'nftView' })
  findOne(@Args('id', { type: () => Int }) id: number) {
    return this.nftViewService.findOne(id);
  }

  @Mutation(() => NftView)
  updateNftView(@Args('updateNftViewInput') updateNftViewInput: UpdateNftViewInput) {
    return this.nftViewService.update(updateNftViewInput.id, updateNftViewInput);
  }

  @Mutation(() => NftView)
  removeNftView(@Args('id', { type: () => Int }) id: number) {
    return this.nftViewService.remove(id);
  }

  @ResolveField()
  async nft(@Parent() nftView: NftView) {
    const { nftId } = nftView;
    return this.nftViewService.countByNftId(nftId);
  }

  @ResolveField()
  async profile(@Parent() nftView: NftView) {
    const { profileId } = nftView;
    return this.nftViewService.countByProfileId(profileId);
  }

  
}
