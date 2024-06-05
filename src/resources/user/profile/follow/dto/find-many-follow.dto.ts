import { Field, InputType } from '@nestjs/graphql';
import { PaginationDto } from 'src/common/pagination.dto';
import { FilterFollowDto } from './filter-follow.dto';

@InputType()
export class FindManyFollowDto {
  @Field(() => PaginationDto, {
    description: 'Pagination fields.',
    nullable: true,
  })
  pagination?: PaginationDto;

  @Field(() => FilterFollowDto, {
    description: 'Filter fields.',
    nullable: true,
  })
  filter?: FilterFollowDto;
}
