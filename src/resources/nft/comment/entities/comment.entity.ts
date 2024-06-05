import { ObjectType, Field, Int, ID, Directive } from '@nestjs/graphql';
import { Paginated } from 'src/common/pagination/pagination.entity';
import { Profile } from 'src/resources/user/profile/entities/profile.entity';
import { Nft } from '../../entities/nft.entity';
import { CommentReply } from '../comment-replies/entities/comment-reply.entity';
import { CommentLike } from '../comment-like/entities/comment-like.entity';

@ObjectType()
@Directive('@key(fields: "id")')
export class Comment {
  @Field(() => ID, { nullable: false })
  id: string;

  @Field(() => String, { nullable: false })
  profileId: string;

  @Field(() => Profile, { nullable: false })
  profile: Profile;

  @Field(() => String, { nullable: false })
  nftId: string;

  @Field(() => Nft, { nullable: false })
  nft: Nft;

  @Field(() => String, { nullable: false })
  description: string;

  //  @Field(() => Number, { nullable: true })
  //   likesCount: number;
  @Field(() => Int, { nullable: true })
  repliesCount: number;

  @Field(() => Int, { nullable: true })
  commentLikesCount: number;

  @Field(() => [CommentReply], { nullable: true })
  commentReply: [CommentReply];

  @Field(() => [CommentLike], { nullable: true })
  commentLike: CommentLike;

  @Field(() => Date, { description: 'User created at time', nullable: false })
  createdAt: Date;

  @Field(() => Date, { description: 'User updated at time', nullable: true })
  updatedAt: Date;

  @Field(() => Boolean, { description: 'User deleted check', nullable: false })
  deleted: boolean;

  @Field(() => Boolean, { description: 'User liked check', nullable: false })
  isLikedFlag: boolean;

  @Field(() => Int, { description: 'User liked check', nullable: false })
  commentCount: number;

}

@ObjectType()
export class PaginatedComment extends Paginated(Comment) { }
