import { BadRequestException, Injectable, InternalServerErrorException } from '@nestjs/common';
import { notificationMessageBuilder, NOTIFICATION_TYPE } from 'src/common/constants';
import { CreateNotificationInput } from 'src/resources/user/notification/dto/create-notification.input';
import { NotificationManagerService } from 'src/shared/notification-manager/notification-manager.service';
import { PrismaService } from 'src/shared/prisma/prisma.service';
import { SessionService } from 'src/shared/session/session.service';
import { CreateCommentLikeInput } from './dto/create-comment-like.input';

@Injectable()
export class CommentLikeService {
  constructor(
    private readonly session: SessionService,
    private readonly prisma: PrismaService,
    private readonly notificationManager: NotificationManagerService,
  ) {}

  async create(createCommentLikeInput: CreateCommentLikeInput) {
    try {
      const userName = this.session.getUserName();
      const createruserId = this.session.getUserId();
      const { commentId } = createCommentLikeInput;
      const profileId = this.session.getUserProfileId();
      const check = await this.prisma.commentlike.findFirst({
        where: { profileId, commentId, deleted: false },
        select: {
          liked: true,
          id: true,
        },
      });
      if (check) {
        if (check.liked == true) {
          const commentLike = await this.prisma.commentlike.update({
            where: {
              id: check.id,
            },
            data: {
              liked: false,
            },
          });
          return commentLike;
        } else {
          const commentLike = await this.prisma.commentlike.update({
            where: {
              id: check.id,
            },
            data: {
              liked: true,
            },
          });
          return commentLike;
        }
      }
      const commentLike = await this.prisma.commentlike.create({
        data: {
          profileId,
          commentId,
        },
      });

      const userId = await this.prisma.comment
        .findFirst({
          where: {
            id: commentId,
          },
          include: {
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
        message: notificationMessageBuilder.commentLike(userName),
        refKey: commentLike?.id,
        title: notificationMessageBuilder.commentLike(userName),
        type: NOTIFICATION_TYPE.COMMENTLIKE,
        createdBy: createruserId,
      };
      await this.notificationManager.create(createNotificationInput);
      return commentLike;
    } catch (error) {
      console.log(error);
      throw new InternalServerErrorException(error);
    }
  }

  async findAllCommentLikes(commentId: string) {
    try {
      const allComment = await this.prisma.commentlike.findMany({
        where: { commentId, liked: true, deleted: false },
      });
      return allComment;
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }

  async likesCount(commentId: string): Promise<number> {
    //TODO: use as a resolve field in comment as fix the name as count
    try {
      const allcommentLikes = await this.prisma.commentlike.count({
        where: { commentId, liked: true, deleted: false },
      });
      return allcommentLikes;
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }

  async populateProfile(profileId: string) {
    try {
      const profile = await this.prisma.profile.findFirst({
        where: {
          deleted: false,
          id: profileId,
        },
      });
      return profile;
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }

  async populateComment(commentId: string) {
    try {
      const comment = await this.prisma.comment.findFirst({
        where: {
          deleted: false,
          id: commentId,
        },
      });
      return comment;
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }

  async populateCommentLike(id: string) {
    try {
      const commentLike = await this.prisma.commentlike.findMany({
        where: {
          commentId: id,
          deleted: false,
        },
      });
      return commentLike;
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }

  async populateCommentLikesCount(id: string) {
    try {
      const count = await this.prisma.commentlike.count({
        where: {
          commentId: id,
          deleted: false,
          liked: true,
        },
      });
      return count;
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }

  async notification_commentLike(refKey: string) {
    try {
      const commentLikeNotification = await this.prisma.commentlike.findFirst({
        where: {
          id: refKey,
          deleted: false,
        },
      });
      return commentLikeNotification;
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }
}
