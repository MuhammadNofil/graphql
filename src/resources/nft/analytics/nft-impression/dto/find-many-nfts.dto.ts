import { Field, InputType } from '@nestjs/graphql';
import { PaginationDto } from 'src/common/pagination.dto';
import { FilterNftImpressionDto } from './filter-nft-impression.dto';

@InputType()
export class FindManyNftImpressionDto {
  @Field(() => PaginationDto, {
    description: 'Pagination fields.',
    nullable: true,
  })
  pagination?: PaginationDto;

  @Field(() => FilterNftImpressionDto, {
    description: 'Filter fields.',
    nullable: true,
  })
  filter?: FilterNftImpressionDto;
}
