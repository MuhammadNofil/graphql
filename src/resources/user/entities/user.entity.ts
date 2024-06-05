import { ObjectType, Field, Int, ID, Directive } from '@nestjs/graphql';
import { Notification } from '../notification/entities/notification.entity';
import { Profile } from '../profile/entities/profile.entity';
import { Wallet } from '../wallet/entities/wallet.entity';
import { Role } from './role.entity';

@ObjectType()
@Directive('@key(fields: "id")')
export class User {
  @Field(() => ID, { description: 'User ID', nullable: false })
  id: string;

  @Field(() => String, { description: 'User name', nullable: false })
  userName: string;

  @Field(() => String, { description: 'User roleID', nullable: false })
  roleId: string;

  @Field(() => Role, { description: 'User roleID', nullable: false })
  role: Role;

  @Field(() => String, { description: 'User email', nullable: false })
  email: string;

  @Field(() => Profile, { description: 'User email', nullable: true })
  profile?: Profile;

  @Field(() => [Wallet], { description: 'User email', nullable: true })
  wallet?: Wallet[];

  @Field(() => [Notification], { description: 'notification', nullable: true })
  notification?: Notification[];

  @Field(() => [Notification], { description: 'the creator of notification', nullable: true })
  notificationCreatedBy?: Notification[];

  @Field(() => Boolean, { description: 'User verified status', nullable: false })
  isVerified: boolean;

  @Field(() => Date, { description: 'User created at time', nullable: false })
  createdAt: Date;

  @Field(() => Date, { description: 'User updated at time', nullable: true })
  updatedAt: Date;

  @Field(() => Boolean, { description: 'User deleted check', nullable: false })
  deleted: boolean;
}
