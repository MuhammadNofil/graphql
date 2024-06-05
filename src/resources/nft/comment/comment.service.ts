import { BadRequestException, Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { PubSub } from 'graphql-subscriptions';
import { MessageEntity } from 'src/common/message.entity';
import { CreateNotificationInput } from 'src/resources/user/notification/dto/create-notification.input';
import { NotificationManagerService } from 'src/shared/notification-manager/notification-manager.service';
import { PrismaService } from 'src/shared/prisma/prisma.service';
import { SessionService } from 'src/shared/session/session.service';
import { CommentLikeService } from './comment-like/comment-like.service';
import { CommentRepliesService } from './comment-replies/comment-replies.service';
import { CreateCommentInput } from './dto/create-comment.input';
import { UpdateCommentInput } from './dto/update-comment.input';
import { Comment } from './entities/comment.entity';
import { DEFAULT_PAGINATION, notificationMessageBuilder, NOTIFICATION_TYPE } from 'src/common/constants';
import { Prisma } from '@prisma/client';
import { FindPaginatedCommentDto } from './dto/find-paginatedComment.dto';

@Injectable()
export class CommentService {
  constructor(
    private readonly session: SessionService,
    private readonly prisma: PrismaService,
    private readonly commentRepliesService: CommentRepliesService,
    private readonly commentLikeService: CommentLikeService,
    private readonly pubsub: PubSub = new PubSub(),
    private readonly notificationManager: NotificationManagerService,
  ) { }
  async create(createCommentInput: CreateCommentInput): Promise<Partial<Comment>> {
    try {
      const userName = this.session.getUserName();
      const createruserId = this.session.getUserId();
      const profileId = this.session.getUserProfileId();
      const comment = await this.prisma.comment.create({
        data: {
          ...createCommentInput,
          profileId,
        },
      });
      const userId = await this.prisma.nft
        .findFirst({
          where: {
            id: createCommentInput.nftId,
          },
          select: {
            profile: {
              select: {
                userId: true,
              },
            },
          },
        })
        .then((e) => e?.profile?.userId);
      const createNotificationInput: CreateNotificationInput = {
        userId,
        message: notificationMessageBuilder.comment(userName),
        refKey: comment?.id,
        title: notificationMessageBuilder.comment(userName),
        type: NOTIFICATION_TYPE.COMMENT,
        createdBy: createruserId,
      };
      await this.notificationManager.create(createNotificationInput);
      return comment;
    } catch (error) {
      console.log(error);
      throw new InternalServerErrorException(error);
    }
  }

  findAll() {
    return `This action returns all comment`;
  }

  async populateProfile(profileId: string) {
    try {
      const profile = await this.prisma.profile.findFirst({
        where: {
          deleted: false,
          id: profileId,
        },
      });
      if (!profile) {
        throw new BadRequestException('Profile not found');
      }
      return profile;
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }

  async populateNft(nftId: string) {
    try {
      const Nft = await this.prisma.nft.findFirst({
        where: {
          deleted: false,
          id: nftId,
        },
      });
      if (!Nft) {
        throw new BadRequestException('Nft not found');
      }
      return Nft;
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }

  findOne(id: string) {
    const comment = this.prisma.comment.findFirst({
      where: {
        id,
        deleted: false
      },
    })
    return comment

  }

  async update(updateCommentInput: UpdateCommentInput) {
    try {
      const { id, description } = updateCommentInput;
      const profileId = this.session.getUserProfileId();
      const check = await this.prisma.comment
        .findFirst({
          where: {
            profileId,
            id,
            deleted: false,
          },
          select: {
            id: true,
          },
        })
        .then((e) => e?.id);
      if (!check) {
        throw new NotFoundException('Comment not found');
      }
      const comment = await this.prisma.comment.update({
        where: {
          id: check,
        },
        data: {
          description,
        },
      });
      return comment;
    } catch (error) { }
  }

  async remove(id: string): Promise<MessageEntity> {
    try {
      const profileId = this.session.getUserProfileId();
      const check = await this.prisma.comment
        .findFirst({
          where: {
            id,
            profileId,
            deleted: false,
          },
          select: {
            id: true,
          },
        })
        .then((e) => e.id);
      if (!check) {
        throw new NotFoundException('Comment not found');
      }
      const comment = await this.prisma.comment
        .update({
          where: {
            id: check,
          },
          data: {
            deleted: true,
          },
          select: {
            deleted: true,
          },
        })
        .then((e) => e.deleted);
      return {
        message: `Comment deleted successfully`,
      };
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }

  async notification_Comment(refKey: string) {
    try {
      const commentNotification = await this.prisma.comment.findFirst({
        where: {
          id: refKey,
          deleted: false,
        },
      });
      return commentNotification;
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }


  async paginatedCommmnt(findPaginatedCommentDto: FindPaginatedCommentDto) {
    const { pagination, nftId } = findPaginatedCommentDto

    const findmanyArgs: Prisma.CommentFindManyArgs = {
      where: {
        deleted: false,
        nftId,
      },
      skip: (pagination?.page - 1) * pagination?.limit || DEFAULT_PAGINATION.PAGE,
      take: +pagination?.limit || DEFAULT_PAGINATION.PAGE_SIZE,
    }
    const data = await this.prisma.comment.findMany(findmanyArgs)
    const count = await this.prisma.comment.count({ where: findmanyArgs?.where });

    return {
      data,
      metadata: {
        page: +pagination?.page || DEFAULT_PAGINATION.PAGE + 1,
        limit: +pagination?.limit || DEFAULT_PAGINATION.PAGE_SIZE,
        total: {
          pages: Math.ceil(count / (+pagination?.limit || DEFAULT_PAGINATION.PAGE_SIZE)),
          records: count,
        },
      },
    }

  }

  async isLikedFlag(commentId: string) {
    try {
      const profileId = this.session.getUserProfileId();
      const liked = await this.prisma.commentlike.findFirst({
        where: {
          profileId,
          commentId,
          liked: true,
          deleted: false

        },

      })
      console.log(liked)
      if (liked) {
        return true;
      }
      return false;
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }

  async commentCount(nftId: string) {
    try {
      const count = this.prisma.comment.count({
        where: {
          nftId,
          deleted: false
        }
      })
      return count
    } catch (error) {
      throw new InternalServerErrorException(error)
    }
  }

  repliesCount(commentId: string) {
    return this.commentRepliesService.repliesCount(commentId);
  }

  populateCommentReplies(commentId: string) {
    return this.commentRepliesService.populateCommentReplies(commentId);
  }

  populateCommentLikes(commentId: string) {
    return this.commentLikeService.populateCommentLike(commentId);
  }

  commentLikesCount(commentId: string) {
    return this.commentLikeService.populateCommentLikesCount(commentId);
  }
}
