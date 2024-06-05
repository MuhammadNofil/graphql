import { Field, InputType } from '@nestjs/graphql';
import { IsOptional } from 'class-validator';
import { PaginationDto } from 'src/common/pagination.dto';
import { FilterRecentNftDto } from './filter-recent-nft.dto';

@InputType()
export class FindRecentNftDto {
  @IsOptional()
  @Field(() => PaginationDto, {
    description: 'Pagination fields.',
    nullable: true,
  })
  pagination?: PaginationDto;

  @IsOptional()
  @Field(() => FilterRecentNftDto, {
    description: 'Filter fields.',
    nullable: true,
  })
  filter?: FilterRecentNftDto;

  

}
