import { Field, InputType } from '@nestjs/graphql';
import { PaginationDto } from 'src/common/pagination.dto';
import { FilterReportGroup } from './fliter-report-group.input';
// import { FilterNftDto } from './filter-nft.dto';
// import { FilterFollowDto } from './filter-follow.dto';

@InputType()
export class FindManyReportGroupDto {
  @Field(() => PaginationDto, {
    description: 'Pagination fields.',
    nullable: true,
  })
  pagination?: PaginationDto;

  @Field(() => FilterReportGroup, {
    description: 'Filter fields.',
    nullable: true,
  })
  filter?: FilterReportGroup;
}
