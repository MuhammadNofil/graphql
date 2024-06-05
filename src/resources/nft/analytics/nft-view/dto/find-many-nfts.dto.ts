import { Field, InputType } from '@nestjs/graphql';
import { PaginationDto } from 'src/common/pagination.dto';
import { FilterNftViewDto } from './filter-nft-view.dto';

@InputType()
export class FindManyNftViewDto {
  @Field(() => PaginationDto, {
    description: 'Pagination fields.',
    nullable: true,
  })
  pagination?: PaginationDto;

  @Field(() => FilterNftViewDto, {
    description: 'Filter fields.',
    nullable: true,
  })
  filter?: FilterNftViewDto;
}
