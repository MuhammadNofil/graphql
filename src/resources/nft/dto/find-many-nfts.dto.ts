import { Field, InputType } from '@nestjs/graphql';
import { PaginationDto } from 'src/common/pagination.dto';
import { FilterNftDto } from './filter-nft.dto';
import { IsNumber, isNumber, IsOptional } from 'class-validator';
// import { FilterFollowDto } from './filter-follow.dto';

@InputType()
export class FindManyNftDto {
  @IsOptional()
  @Field(() => PaginationDto, {
    description: 'Pagination fields.',
    nullable: true,
  })
  pagination?: PaginationDto;

  @IsOptional()
  @Field(() => FilterNftDto, {
    description: 'Filter fields.',
    nullable: true,
  })
  filter?: FilterNftDto;
}
