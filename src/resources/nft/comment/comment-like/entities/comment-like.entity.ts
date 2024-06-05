import { ObjectType, Field, Int, ID, Directive } from '@nestjs/graphql';
import { Comment } from 'src/resources/nft/comment/entities/comment.entity';
import { Profile } from 'src/resources/user/profile/entities/profile.entity';

@ObjectType()
@Directive('@key(fields: "id")')
export class CommentLike {
  @Field(() => ID, { description: 'follow ID' })
  id: string;

  @Field(() => String, { nullable: false })
  profileId: string;

  @Field(() => String, { nullable: false })
  commentId: string;

  @Field(() => Comment, { nullable: false })
  comment: Comment;

  @Field(() => Profile, { nullable: false })
  profile: Profile;

  @Field(() => Boolean, { nullable: false })
  deleted: boolean;

  @Field(() => Date, { nullable: false })
  createdAt: Date;

  @Field(() => Date, { nullable: false })
  updatedAt: Date | null;

  @Field(() => Boolean, { nullable: false })
  liked: boolean;
}
