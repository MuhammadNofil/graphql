import { CreateReportGroupInput } from './create-report-group.input';
import { InputType, Field, Int, PartialType } from '@nestjs/graphql';

@InputType()
export class UpdateReportGroupInput extends PartialType(CreateReportGroupInput) {
  @Field(() => Int)
  id: number;
}
