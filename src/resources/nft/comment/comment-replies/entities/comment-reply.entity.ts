import { ObjectType, Field, Int, ID, Directive } from '@nestjs/graphql';
import { Comment } from 'src/resources/nft/comment/entities/comment.entity';
import { Profile } from 'src/resources/user/profile/entities/profile.entity';

@ObjectType()
@Directive('@key(fields: "id")')
export class CommentReply {
  @Field(() => ID, { nullable: false })
  id: string;

  @Field(() => String, { nullable: false })
  description: string;

  @Field(() => String, { nullable: false })
  profileId: string;

  @Field(() => Profile, { nullable: false })
  profile: Profile;

  @Field(() => String, { nullable: false })
  commentId: string;

  @Field(() => Comment, { nullable: false })
  comment: Comment;

  @Field(() => Date, { nullable: false })
  createdAt: Date;

  @Field(() => Date, { nullable: false })
  updatedAt: Date | null;

  @Field(() => Boolean, { nullable: false })
  deleted: boolean;
}
