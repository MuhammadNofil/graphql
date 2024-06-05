import { Resolver, Query, Mutation, Args, Int, ResolveField, Parent } from '@nestjs/graphql';
import { ReportProfileService } from './report-profile.service';
import { ReportProfile } from './entities/report-profile.entity';
import { CreateReportProfileInput } from './dto/create-report-profile.input';
import { UpdateReportProfileInput } from './dto/update-report-profile.input';
import { UseGuards } from '@nestjs/common';
import { GqlAuthGuard } from 'src/shared/guards/gql-authguard';

@Resolver(() => ReportProfile)
export class ReportProfileResolver {
  constructor(private readonly reportProfileService: ReportProfileService) {}

  @UseGuards(GqlAuthGuard)
  @Mutation(() => ReportProfile)
  createReportProfile(@Args('createReportProfileInput') createReportProfileInput: CreateReportProfileInput) {
    return this.reportProfileService.create(createReportProfileInput);
  }

  @UseGuards(GqlAuthGuard)
  @Query(() => [ReportProfile])
  findAllReportedProfile() {
    return this.reportProfileService.findAll();
  }

  @ResolveField()
  async profile(@Parent() reportProfile: ReportProfile) {
    const { profileId } = reportProfile;
    return this.reportProfileService.populateProfile(profileId);
  }

  @ResolveField()
  async reportedProfile(@Parent() reportProfile: ReportProfile) {
    const { reportedProfileId } = reportProfile;
    return this.reportProfileService.populateProfile(reportedProfileId);
  }

  // @Query(() => ReportProfile, { name: 'reportProfile' })
  // findOne(@Args('id', { type: () => Int }) id: number) {
  //   return this.reportProfileService.findOne(id);
  // }

  // @Mutation(() => ReportProfile)
  // updateReportProfile(@Args('updateReportProfileInput') updateReportProfileInput: UpdateReportProfileInput) {
  //   return this.reportProfileService.update(updateReportProfileInput.id, updateReportProfileInput);
  // }

  // @Mutation(() => ReportProfile)
  // removeReportProfile(@Args('id', { type: () => Int }) id: number) {
  //   return this.reportProfileService.remove(id);
  // }
}
