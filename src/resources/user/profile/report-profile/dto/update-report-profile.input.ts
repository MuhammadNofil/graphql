import { CreateReportProfileInput } from './create-report-profile.input';
import { InputType, Field, Int, PartialType } from '@nestjs/graphql';

@InputType()
export class UpdateReportProfileInput extends PartialType(CreateReportProfileInput) {
  @Field(() => Int)
  id: number;
}
