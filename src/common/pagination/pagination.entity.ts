import { Type } from '@nestjs/common';
import { Field, Int, ObjectType } from '@nestjs/graphql';

export interface IPaginatedType<T> {
  data: T[];
  metadata: {
    page: number;
    limit: number;
    total: {
      pages: number;
      records: number;
    };
  };
}

export function Paginated<T>(classRef: Type<T>): Type<IPaginatedType<T>> {
  @ObjectType({ isAbstract: true })
  abstract class PaginatedType implements IPaginatedType<T> {
    @Field(() => [classRef], { nullable: true })
    data: T[];

    @Field(() => PaginationMetadata, { nullable: true })
    metadata: PaginationMetadata;
  }
  return PaginatedType as Type<IPaginatedType<T>>;
}

@ObjectType()
export class PaginationTotal {
  @Field(() => Int)
  pages: number;

  @Field(() => Int)
  records: number;
}

@ObjectType()
export class PaginationMetadata {
  @Field(() => Int)
  page: number;

  @Field(() => Int)
  limit: number;

  @Field(() => PaginationTotal)
  total: PaginationTotal;
}
