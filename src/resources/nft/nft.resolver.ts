import { Resolver, Query, Mutation, Args, Int, Parent, ResolveField } from '@nestjs/graphql';
import { NftService } from './nft.service';
import { Nft, PaginatedNft } from './entities/nft.entity';
import { CreateNftInput } from './dto/create-nft.input';
import { UpdateNftInput } from './dto/update-nft.input';
import { UseGuards } from '@nestjs/common';
import { GqlAuthGuard } from 'src/shared/guards/gql-authguard';
import { FindManyNftDto } from './dto/find-many-nfts.dto';
import { PaginationDto } from 'src/common/pagination.dto';
import { FindRecentNftDto } from './dto/find-recent-nft.dto';
import { FindAllProfileNftsDto } from './report-nft/dto/find-all-profile-nfts.dto';
import { MessageEntity } from 'src/common/message.entity';
import { filterNftInputArgs } from './report-nft/dto/filter-nft-by-choice.dto';

@Resolver(() => Nft)
export class NftResolver {
  constructor(private readonly nftService: NftService) {}

  @UseGuards(GqlAuthGuard)
  @Mutation(() => Nft)
  createNft(@Args('createNftInput') createNftInput: CreateNftInput) {
    return this.nftService.create(createNftInput);
  }

  @Mutation(() => String)
  createNftSignature(@Args('nftId') nftId: string) {
    return this.nftService.nftsignature(nftId);
  }

  @Mutation(() => Nft)
  getNftViaLink(@Args('id') id: string) {
    return this.nftService.getNftViaLink(id);
  }

  @UseGuards(GqlAuthGuard)
  @Query(() => PaginatedNft)
  findAllNfts(@Args('findManyNftDto') findManyNftDto: FindManyNftDto) {
    return this.nftService.findAll(findManyNftDto);
  }

  @UseGuards(GqlAuthGuard)
  @Query(() => PaginatedNft)
  topratedNFt(@Args('pagination') pagination: PaginationDto) {
    return this.nftService.topRatedNfts(pagination);
  }

  @UseGuards(GqlAuthGuard)
  @Query(() => PaginatedNft)
  findAllProfileNfts(@Args('findAllProfileNftsDto') findAllProfileNftsDto: FindAllProfileNftsDto) {
    return this.nftService.findAllProfileNfts(findAllProfileNftsDto);
  }

  @UseGuards(GqlAuthGuard)
  @Query(() => PaginatedNft)
  findRecentNfts(@Args('findRecentNftDto') findRecentNftDto: FindRecentNftDto) {
    return this.nftService.nftFindMnay(findRecentNftDto);
  }

  @UseGuards(GqlAuthGuard)
  @Query(() => Nft)
  findOneNft(@Args('id', { type: () => String }) id: string) {
    return this.nftService.findOne(id);
  }

  @UseGuards(GqlAuthGuard)
  @Query(() => Boolean)
  findNftLikeFlag(@Args('nftId') nftId: string) {
    return this.nftService.findNftLikeFlag(nftId);
  }

  @UseGuards(GqlAuthGuard)
  @Query(() => PaginatedNft)
  filterNft(@Args('filterNftInputArgs') filterNftInputArgs: filterNftInputArgs) {
    return this.nftService.filterNft(filterNftInputArgs);
  }

  //will not be updated
  // @Mutation(() => Nft)
  // updateNft(@Args('updateNftInput') updateNftInput: UpdateNftInput) {
  //   return this.nftService.update(updateNftInput.id, updateNftInput);
  // }

  @UseGuards(GqlAuthGuard)
  @Mutation(() => PaginatedNft)
  nftToRate(@Args('paginationDto') paginationDto: PaginationDto) {
    return this.nftService.nftToRate(paginationDto);
  }

  // @Mutation(() => Nft)
  // removeNft(@Args('id', { type: () => Int }) id: number) {
  //   return this.nftService.remove(id);
  // }

  @ResolveField()
  async profile(@Parent() nft: Nft) {
    const { profileId } = nft;
    return this.nftService.populateProfile(profileId);
  }

  @ResolveField()
  async rateNft(@Parent() nft: Nft) {
    const { id } = nft;
    return this.nftService.populateRateNft(id);
  }

  @ResolveField()
  async wallet(@Parent() nft: Nft) {
    const { walletId } = nft;
    return this.nftService.populateWallet(walletId);
  }

  @ResolveField()
  async likesCount(@Parent() nft: Nft) {
    const { id } = nft;
    return this.nftService.likesCount(id);
  }

  @ResolveField()
  async comment(@Parent() nft: Nft) {
    const { id } = nft;
    return this.nftService.populateComments(id);
  }

  @ResolveField()
  async commentCount(@Parent() nft: Nft) {
    const { id } = nft;
    return this.nftService.commentCount(id);
  }

  @ResolveField()
  async nftImpression(@Parent() nft: Nft) {
    const { id } = nft;
    return this.nftService.countNftImpression(id);
  }

  @ResolveField()
  async nftView(@Parent() nft: Nft) {
    const { id } = nft;
    return this.nftService.countNftView(id);
  }

  @ResolveField()
  async groupPost(@Parent() nft: Nft) {
    const { id } = nft;
    return this.nftService.populateGroupPost(id);
  }

  @ResolveField()
  async isLiked(@Parent() nft: Nft) {
    const { id } = nft;
    return this.nftService.isLikedFlag(id);
  }

  @ResolveField()
  async stats(@Parent() nft: Nft) {
    const { id } = nft;
    return this.nftService.stats(id);
  }
}
