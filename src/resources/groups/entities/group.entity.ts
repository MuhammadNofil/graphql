import { ObjectType, Field, Int, ID, Directive } from '@nestjs/graphql';
import { Paginated } from 'src/common/pagination/pagination.entity';
import { Profile } from 'src/resources/user/profile/entities/profile.entity';
import { GroupPost } from '../group-post/entities/group-post.entity';

@ObjectType()
@Directive('@key(fields: "id")')
export class Group {
  @Field(() => ID, { description: 'follow ID', nullable: false })
  id: string;

  @Field(() => String, { nullable: false })
  ownerProfileId: string;

  @Field(() => Profile, { nullable: false })
  profile: Profile;

  @Field(() => String, { nullable: false })
  name: string;

  @Field(() => String, { nullable: true })
  banner: string;

  @Field(() => String, { nullable: true })
  displayImage: string;

  @Field(() => String, { nullable: true })
  category: string;

  @Field(() => [GroupPost], { description: 'Example field (placeholder)', nullable: true })
  groupPost: GroupPost[];

  @Field(() => Number, { description: 'Example field (placeholder)', nullable: true })
  PostCount: number;

  @Field(() => Number, { description: 'Example field (placeholder)', nullable: true })
  memberCount: number;

  @Field(() => String, { nullable: false })
  isPrivate: boolean;

  @Field(() => Boolean, { nullable: false })
  deleted: boolean;

  @Field(() => Date, { nullable: false })
  createdAt: Date;

  @Field(() => Date, { nullable: true })
  updatedAt: Date | null;
}

@ObjectType()
export class PaginatedGroup extends Paginated(Group) {}
