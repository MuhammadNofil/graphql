import { Field, InputType } from '@nestjs/graphql';
import { IsOptional, IsString } from 'class-validator';
import { PaginationDto } from 'src/common/pagination.dto';
import { FilterGroupDto } from './filter-group.dto';

@InputType()
export class FindManyGrouptDto {
  @IsOptional()
  @Field(() => PaginationDto, {
    description: 'Pagination fields.',
    nullable: true,
  })
  pagination?: PaginationDto;

  @IsOptional()
  @Field(() => FilterGroupDto, {
    description: 'Filter fields.',
    nullable: true,
  })
  filter?: FilterGroupDto;
}
