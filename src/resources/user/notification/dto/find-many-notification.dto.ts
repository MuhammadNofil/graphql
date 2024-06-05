import { Field, InputType } from '@nestjs/graphql';
import { IsOptional } from 'class-validator';
import { PaginationDto } from 'src/common/pagination.dto';
import { FilterNotificationDto } from './filter-notification.dto';

@InputType()
export class FindManyNotificationDto {
  @IsOptional()
  @Field(() => PaginationDto, {
    description: 'Pagination fields.',
    nullable: true,
  })
  pagination?: PaginationDto;

  @IsOptional()
  @Field(() => FilterNotificationDto, {
    description: 'Filter fields.',
    nullable: true,
  })
  filter?: FilterNotificationDto;
}
