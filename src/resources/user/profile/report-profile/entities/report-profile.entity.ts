import { ObjectType, Field, Int, ID, Directive } from '@nestjs/graphql';
import { Profile } from '../../entities/profile.entity';

@ObjectType()
@Directive('@key(fields: "id")')
export class ReportProfile {
  @Field(() => ID, { description: 'follow ID', nullable: false })
  id: string;

  @Field(() => String, { description: 'profile ID', nullable: false })
  profileId: string;

  @Field(() => Profile, { description: 'profile', nullable: false })
  profile: Profile;

  @Field(() => String, { description: 'profile ID', nullable: false })
  reportedProfileId: string;

  @Field(() => Profile, { description: 'profile', nullable: false })
  reportedProfile: Profile;

  @Field(() => String, { description: 'report type', nullable: false })
  reportType: string;

  @Field(() => String, { description: 'description', nullable: true })
  description: string;

  @Field(() => Boolean, { description: 'resolved property', nullable: false })
  resolved: boolean;

  @Field(() => Date, { description: 'created date time', nullable: false })
  createdAt: Date;

  @Field(() => Date, { description: 'updated date time', nullable: false })
  updatedAt: Date | null;

  @Field(() => Boolean, { description: 'soft delete property', nullable: false })
  deleted: boolean;
}
