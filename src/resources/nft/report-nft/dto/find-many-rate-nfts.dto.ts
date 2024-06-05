import { Field, InputType } from '@nestjs/graphql';
import { IsOptional } from 'class-validator';
import { PaginationDto } from 'src/common/pagination.dto';
import { FilterReportNftDto } from './filter-report-nft.dto';

@InputType()
export class FindManyReportNftDto {
  @IsOptional()
  @Field(() => PaginationDto, {
    description: 'Pagination fields.',
    nullable: true,
  })
  pagination?: PaginationDto;

  @IsOptional()
  @Field(() => FilterReportNftDto, {
    description: 'Filter fields.',
    nullable: true,
  })
  filter?: FilterReportNftDto;
}
