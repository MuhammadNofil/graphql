import { Field, InputType } from '@nestjs/graphql';
import { IsOptional } from 'class-validator';
import { PaginationDto } from 'src/common/pagination.dto';
import { FilterRateNftDto } from './filter-rate-nft.dto';

@InputType()
export class FindManyRateNftDto {
  @IsOptional()
  @Field(() => PaginationDto, {
    description: 'Pagination fields.',
    nullable: true,
  })
  pagination?: PaginationDto;

  @IsOptional()
  @Field(() => FilterRateNftDto, {
    description: 'Filter fields.',
    nullable: true,
  })
  filter?: FilterRateNftDto;
}
