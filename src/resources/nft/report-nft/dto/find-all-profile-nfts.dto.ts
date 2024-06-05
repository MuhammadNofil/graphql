import { Field, InputType } from '@nestjs/graphql';
import { IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { PaginationDto } from 'src/common/pagination.dto';
import { FilterNftDto } from '../../dto/filter-nft.dto';

@InputType()
export class FindAllProfileNftsDto {
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





  @IsNotEmpty()
  @IsString()
  @Field(() => String, { description: 'profile ID', nullable: false })
  profileId: string;
}
