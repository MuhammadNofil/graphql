import { Resolver, Query, Mutation, Args, Int } from '@nestjs/graphql';
import { ReportGroupService } from './report-group.service';
import { PaginatedReportGroup, ReportGroup } from './entities/report-group.entity';
import { CreateReportGroupInput } from './dto/create-report-group.input';
import { UpdateReportGroupInput } from './dto/update-report-group.input';
import { GqlAuthGuard } from 'src/shared/guards/gql-authguard';
import { UseGuards } from '@nestjs/common';
import { FindManyReportGroupDto } from './dto/many-reportgroup-post.input';

@Resolver(() => ReportGroup)
export class ReportGroupResolver {
  constructor(private readonly reportGroupService: ReportGroupService) {}

  @UseGuards(GqlAuthGuard)
  @Mutation(() => ReportGroup)
  createReportGroup(@Args('createReportGroupInput') createReportGroupInput: CreateReportGroupInput) {
    return this.reportGroupService.create(createReportGroupInput);
  }

  @UseGuards(GqlAuthGuard)
  @Query(() => PaginatedReportGroup )
  findAllGroupReports(@Args('findManyReportGroupDto') findManyReportGroupDto:FindManyReportGroupDto) {
    return this.reportGroupService.myGroupReports(findManyReportGroupDto);
  }

}

//   @Query(() => [ReportGroup], { name: 'reportGroup' })
//   findAll() {
//     return this.reportGroupService.findAll();
//   }

//   @Query(() => ReportGroup, { name: 'reportGroup' })
//   findOne(@Args('id', { type: () => Int }) id: number) {
//     return this.reportGroupService.findOne(id);
//   }

//   @Mutation(() => ReportGroup)
//   updateReportGroup(@Args('updateReportGroupInput') updateReportGroupInput: UpdateReportGroupInput) {
//     return this.reportGroupService.update(updateReportGroupInput.id, updateReportGroupInput);
//   }

//   @Mutation(() => ReportGroup)
//   removeReportGroup(@Args('id', { type: () => Int }) id: number) {
//     return this.reportGroupService.remove(id);
//   }
// }
