import { Resolver, Query, Mutation, Args, Int, Parent, ResolveField } from '@nestjs/graphql';
import { ReportNftService } from './report-nft.service';
import { PaginatedReportNft, ReportNft } from './entities/report-nft.entity';
import { CreateReportNftInput } from './dto/create-report-nft.input';
import { UpdateReportNftInput } from './dto/update-report-nft.input';
import { FindManyReportNftDto } from './dto/find-many-rate-nfts.dto';
import { UseGuards } from '@nestjs/common';
import { GqlAuthGuard } from 'src/shared/guards/gql-authguard';

@Resolver(() => ReportNft)
export class ReportNftResolver {
  constructor(private readonly reportNftService: ReportNftService) {}
  
  
  @UseGuards(GqlAuthGuard)
  @Mutation(() => ReportNft)
  createReportNft(@Args('createReportNftInput') createReportNftInput: CreateReportNftInput) {
    return this.reportNftService.create(createReportNftInput);
  }
  @UseGuards(GqlAuthGuard)
  @Query(() => PaginatedReportNft)
  findAllReportNfts(@Args('findManyReportNftDto') findManyReportNftDto: FindManyReportNftDto) {
    return this.reportNftService.myNftReports(findManyReportNftDto);
  }

  // @Query(() => ReportNft, { name: 'reportNft' })
  // findOne(@Args('id', { type: () => Int }) id: number) {
  //   return this.reportNftService.findOne(id);
  // }

  // @Mutation(() => ReportNft)
  // updateReportNft(@Args('updateReportNftInput') updateReportNftInput: UpdateReportNftInput) {
  //   return this.reportNftService.update(updateReportNftInput.id, updateReportNftInput);
  // }

  // @Mutation(() => ReportNft)
  // removeReportNft(@Args('id', { type: () => Int }) id: number) {
  //   return this.reportNftService.remove(id);
  // }

  @ResolveField()
  async nft(@Parent() reportNft: ReportNft) {
    const { nftId } = reportNft;
    return this.reportNftService.populateNft(nftId);
  }

  @ResolveField()
  async reporterProfile(@Parent() reportNft: ReportNft) {
    const { reporterProfileId } = reportNft;
    return this.reportNftService.populateProfile(reporterProfileId);
  }

}
