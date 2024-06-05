import { Field, InputType } from '@nestjs/graphql';

@InputType()
export class FilterReportGroup {
  @Field(() => String, { description: 'title of the nft', nullable: true })
  nftTitle: string;

  @Field(() => Boolean, { description: 'issue resolved?', nullable: true })
  resolved: boolean

  @Field(() => String, { description: 'what is the report type', nullable: true })
  reportType: string;



}
