import { CreateReportNftInput } from './create-report-nft.input';
import { InputType, Field, Int, PartialType } from '@nestjs/graphql';

@InputType()
export class UpdateReportNftInput extends PartialType(CreateReportNftInput) {
  @Field(() => Int)
  id: number;
}
