import { ObjectType, Field, Int, ID, Directive } from '@nestjs/graphql';
import { Paginated } from 'src/common/pagination/pagination.entity';
import { Profile } from 'src/resources/user/profile/entities/profile.entity';
import { Group } from '../../entities/group.entity';

@ObjectType()
@Directive('@key(fields: "id")')
export class ReportGroup {
  @Field(() => ID, { nullable: false })
  id: string;

  @Field(() => String, { nullable: false })
  reporterProfileId: string;

  @Field(() => Profile, { nullable: false })
  reporterProfile: Profile;

  @Field(() => String, { nullable: false })
  groupId: string;

  @Field(() => Group, { nullable: false })
  group: Group;

  @Field(() => String, { nullable: true })
  description: string;

  @Field(() => String, { nullable: true })
  reportType: string;

  @Field(() => Boolean, { description: 'User deleted check', nullable: false })
  resolved: boolean;

  @Field(() => Date, { description: 'User created at time', nullable: false })
  createdAt: Date;

  @Field(() => Date, { description: 'User updated at time', nullable: true })
  updatedAt: Date;

  @Field(() => Boolean, { description: 'User deleted check', nullable: false })
  deleted: boolean;
}

@ObjectType()
export class PaginatedReportGroup extends Paginated(ReportGroup) {}
