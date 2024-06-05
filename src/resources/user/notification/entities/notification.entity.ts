import { ObjectType, Field, Int, ID, registerEnumType } from '@nestjs/graphql';
import { Paginated } from 'src/common/pagination/pagination.entity';
import { User } from '../../entities/user.entity';
import { NOTIFICATION_TYPE } from 'src/common/constants';

registerEnumType(NOTIFICATION_TYPE, {
  name: 'NOTIFICATION_TYPE',
  description: 'Type of notification',
});
@ObjectType()
export class Notification {
  @Field(() => ID, { description: 'follow ID', nullable: false })
  id: string;

  @Field(() => String, { description: 'profile ID', nullable: false })
  userId: string;

  @Field(() => User, { description: 'profile', nullable: false })
  user: User;

  @Field(() => String, { description: 'profile ID', nullable: true })
  createdBy: string;

  @Field(() => User, { description: 'profile', nullable: true })
  createdByUser: User;

  @Field(() => String, { description: 'profile ID', nullable: false })
  title: string;

  @Field(() => String, { description: 'profile ID', nullable: false })
  message: string;

  @Field(() => String, { description: 'profile ID', nullable: false })
  refKey: string;

  @Field(() => String, { description: 'icon for notification', nullable: true })
  icon: string;

  @Field(() => NOTIFICATION_TYPE, { description: 'profile ID', nullable: false })
  type: NOTIFICATION_TYPE;

  @Field(() => Boolean, { description: 'soft delete property', nullable: false })
  isRead: boolean;

  @Field(() => Date, { description: 'created date time', nullable: false })
  createdAt: Date;

  @Field(() => Date, { description: 'updated date time', nullable: false })
  updatedAt: Date | null;

  @Field(() => Boolean, { description: 'soft delete property', nullable: false })
  deleted: boolean;
}

@ObjectType()
export class PaginatedNotification extends Paginated(Notification) {}
