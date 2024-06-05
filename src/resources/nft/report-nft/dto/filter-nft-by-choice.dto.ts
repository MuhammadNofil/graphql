import { Field, InputType } from '@nestjs/graphql';
import { IsOptional } from 'class-validator';
import { PaginationDto } from 'src/common/pagination.dto';
import { FilterNftArgs } from './multi-filter-nft.dto';

@InputType()
export class filterNftInputArgs {
  @IsOptional()
  @Field(() => PaginationDto, {
    description: 'Pagination fields.',
    nullable: true,
  })
  pagination?: PaginationDto;

  @IsOptional()
  @Field(() => FilterNftArgs, {
    description: 'Filter fields.',
    nullable: true,
  })
  filter?: FilterNftArgs;
}
