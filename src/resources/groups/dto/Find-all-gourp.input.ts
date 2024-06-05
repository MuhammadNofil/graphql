import { Field, InputType } from '@nestjs/graphql';
import { PaginationDto } from 'src/common/pagination.dto';
import{ FilterAllGroupDto, } from './filter-all-group.input'

@InputType()
export class FindAllGrouptDto {
  @Field(() => PaginationDto, {
    description: 'Pagination fields.',
    nullable: true,
  })
  pagination?: PaginationDto;

  @Field(() => FilterAllGroupDto, {
    description: 'Filter fields.',
    nullable: true,
  })
  filter?: FilterAllGroupDto;
}
