import { Field, InputType } from '@nestjs/graphql';
import { IsNotEmpty, IsOptional } from 'class-validator';
import { PaginationDto } from 'src/common/pagination.dto';

@InputType()
export class PaginatedLikedDto {
  @IsOptional()
  @Field(() => PaginationDto, {
    description: 'Pagination fields.',
    nullable: true,
  })
  pagination?: PaginationDto;

  @IsNotEmpty()
  @Field(() => String)
  nftId: string;
}
