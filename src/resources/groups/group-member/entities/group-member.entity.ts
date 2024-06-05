import { ObjectType, Field, Int, ID, Directive } from '@nestjs/graphql';
import { Profile } from 'src/resources/user/profile/entities/profile.entity';
import { Group } from '../../entities/group.entity';

@ObjectType()
@Directive('@key(fields: "id")')
export class GroupMember {
  @Field(() => ID, { nullable: false })
  id: string;

  @Field(() => String, { nullable: false })
  profileId: string;

  @Field(() => Profile, { nullable: false })
  profile: Profile;

 
  @Field(() => String, { nullable: false })
  groupId: string;

  @Field(() => Group, { nullable: false })
  group: Group;

  @Field(() => String, { nullable: true })
  role: string;

  @Field(() => Boolean, { description: 'User deleted check', nullable: false })
  isMuted: boolean;

  @Field(() => Date, { description: 'User created at time', nullable: false })
  createdAt: Date;

  @Field(() => Date, { description: 'User updated at time', nullable: true })
  updatedAt: Date;

  @Field(() => Boolean, { description: 'User deleted check', nullable: false })
  deleted: boolean;
}
