import { Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { notificationMessageBuilder, NOTIFICATION_TYPE } from 'src/common/constants';
import { MessageEntity } from 'src/common/message.entity';
import { CreateNotificationInput } from 'src/resources/user/notification/dto/create-notification.input';
import { NotificationManagerService } from 'src/shared/notification-manager/notification-manager.service';
import { PrismaService } from 'src/shared/prisma/prisma.service';
import { SessionService } from 'src/shared/session/session.service';
import { CreateCommentReplyInput } from './dto/create-comment-reply.input';
import { UpdateCommentReplyInput } from './dto/update-comment-reply.input';
import { CommentReply } from './entities/comment-reply.entity';

@Injectable()
export class CommentRepliesService {
  constructor(
    private readonly session: SessionService,
    private readonly prisma: PrismaService,
    private readonly notificationManager: NotificationManagerService,
  ) { }
  async create(createCommentReplyInput: CreateCommentReplyInput) {
    try {
      const userName = this.session.getUserName();
      const createruserId = this.session.getUserId();
      const profileId = this.session.getUserProfileId();
      console.log(createCommentReplyInput, profileId);
      const reply = await this.prisma.commentreply.create({
        data: {
          profileId,
          ...createCommentReplyInput,
        },
      });
      const userId = await this.prisma.comment
        .findFirst({
          where: {
            id: createCommentReplyInput.commentId,
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
        message: notificationMessageBuilder.commentReply(userName),
        refKey: reply?.id,
        title: notificationMessageBuilder.commentReply(userName),
        type: NOTIFICATION_TYPE.COMMENTREPLIES,
        createdBy: createruserId,
      };
      await this.notificationManager.create(createNotificationInput);
      return reply;
    } catch (error) {
      console.log(error);
      throw new InternalServerErrorException(error);
    }
  }

  async findAllCommentReplies(commentId: string) {
    try {
      const allComment = await this.prisma.commentreply.findMany({
        where: { commentId, deleted: false },
      });
      return allComment;
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

  async repliesCount(commentId: string): Promise<number> {
    try {
      const CommentReplies = await this.prisma.commentreply.count({
        where: { commentId, deleted: false },
      });
      return CommentReplies;
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }

  async populateCommentReplies(id: string) {
    try {
      const commentReply = await this.prisma.commentreply.findMany({
        where: {
          commentId: id,
          deleted: false,
        },
      });
      return commentReply;
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }

  async findAll() {
    const replies = await this.prisma.commentreply.findFirst({
      where: { deleted: false },
    });
  }

  async update(updateCommentReplyInput: UpdateCommentReplyInput) {
    try {
      const { id, description } = updateCommentReplyInput;
      const profileId = this.session.getUserProfileId();
      const check = await this.prisma.commentreply
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
        .then((e) => e.id);
      if (!check) {
        throw new NotFoundException('Comment-reply not found');
      }
      const commentReply = await this.prisma.commentreply.update({
        where: {
          id: check,
        },
        data: {
          description,
        },
      });
      return commentReply;
    } catch (error) { }
  }

  async remove(id: string): Promise<MessageEntity> {
    try {
      const profileId = this.session.getUserProfileId();
      const check = await this.prisma.commentreply
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
        .then((e) => e?.id);
      console.log(check)
      if (!check) {
        throw new NotFoundException('Comment-reply not found');
      }
      const commentReply = await this.prisma.commentreply
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
        message: `Comment-reply deleted successfully`
      };
    } catch (error) {
      console.log(error)
      throw new InternalServerErrorException(error);
    }
  }

  async notification_commentReply(refKey: string) {
    try {
      const commentReplyNotification = await this.prisma.commentlike.findFirst({
        where: {
          id: refKey,
          deleted: false,
        },
      });
      return commentReplyNotification;
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }

  // update(id: number, updateCommentReplyInput: UpdateCommentReplyInput) {
  //   return `This action updates a #${id} commentReply`;
  // }

  // remove(id: number) {
  //   return `This action removes a #${id} commentReply`;
  // }

  // findOne(id: number) {
  //   return `This action returns a #${id} commentReply`;
  // }
}
