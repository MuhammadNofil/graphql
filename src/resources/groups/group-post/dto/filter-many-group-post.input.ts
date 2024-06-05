import { Field, InputType } from '@nestjs/graphql';
import { IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';
import { PaginationDto } from 'src/common/pagination.dto';
import { FilterGroupPostDto } from './filter-group-post.input';

@InputType()
export class FindManyGroupPostDto {
 
  @IsOptional()
  @Field(() => PaginationDto, {
    description: 'Pagination fields.',
    nullable: true,
  })
  pagination?: PaginationDto;

  @IsOptional()
  @Field(() => FilterGroupPostDto, {
    description: 'Filter fields.',
    nullable: true,
  })
  filter?: FilterGroupPostDto;
}
