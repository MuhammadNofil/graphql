import { BadRequestException, Injectable, InternalServerErrorException } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { DEFAULT_PAGINATION, NOTIFICATION_TYPE } from 'src/common/constants';
import { PaginationDto } from 'src/common/pagination.dto';
import { PrismaService } from 'src/shared/prisma/prisma.service';
import { SessionService } from 'src/shared/session/session.service';
import { CreateNotificationInput } from './dto/create-notification.input';
import { FindManyNotificationDto } from './dto/find-many-notification.dto';
import { UpdateNotificationInput } from './dto/update-notification.input';

@Injectable()
export class NotificationService {
  constructor(private readonly prisma: PrismaService, private readonly sessionService: SessionService) {}
  // create(createNotificationInput: CreateNotificationInput) {
  //   return 'This action adds a new notification';
  // }

  async findAll(findManyNotificationDto: FindManyNotificationDto) {
    try {
      const { filter, pagination } = findManyNotificationDto;
      console.log(filter, pagination);
      const userId: string = this.sessionService.getUserId();
      const where: Prisma.NotificationWhereInput = {
        userId,
      };
      if (filter) {
        where.isRead = filter?.isRead;
      }
      const data = await this.prisma.notification.findMany({
        where,
        orderBy: [{ createdAt: 'desc' }],
        skip: (pagination?.page - 1) * pagination?.limit || DEFAULT_PAGINATION.PAGE,
        take: +pagination?.limit || DEFAULT_PAGINATION.PAGE_SIZE,
      });
      const count = await this.prisma.notification.count({ where });
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
      };
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }

  // findOne(id: number) {
  //   try {
  //   } catch (error) {}
  // }

  async updateRead(updateNotificationInput: UpdateNotificationInput) {
    try {
      const userId: string = this.sessionService.getUserId();
      const id = await this.prisma.notification
        .findFirst({
          where: {
            userId,
            id: updateNotificationInput?.id,
            deleted: false,
          },
          select: {
            id: true,
          },
        })
        .then((e) => e?.id);
      const update = await this.prisma.notification.update({
        where: {
          id,
        },
        data: {
          isRead: true,
        },
      });
      return update;
    } catch (error) {
      console.log(error);
      throw new InternalServerErrorException(error);
    }
  }

  async remove(id: string) {
    try {
      const userId: string = this.sessionService.getUser();
      const notificationId = await this.prisma.notification
        .findFirst({
          where: {
            userId,
            id: id,
            deleted: false,
          },
          select: {
            id: true,
          },
        })
        .then((e) => e?.id);
      const update = await this.prisma.notification.update({
        where: {
          id: notificationId,
        },
        data: {
          deleted: true,
        },
      });
      return {
        message: 'Notification deleted successfully',
      };
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }

  async populateUser(userId: string) {
    try {
      const check = await this.prisma.user.findFirst({
        where: {
          id: userId,
          deleted: false,
        },
      });
      return check;
    } catch (error) {}
  }

  async populateCreatedByUser(userId: string) {
    try {
      const check = await this.prisma.user.findFirst({
        where: {
          id: userId,
          deleted: false,
        },
      });
      return check;
    } catch (error) {}
  }

  async populateIcon(type: NOTIFICATION_TYPE, refKey: string) {
    try {
      let icon: string = '';
      if (!type) {
        throw new BadRequestException(`Notification type not found`);
      }
      if (type === NOTIFICATION_TYPE.GROUPINVITE) {
        icon = await this.prisma.groupInvite
          .findFirst({
            where: {
              id: refKey,
            },
            select: {
              group: {
                select: {
                  displayImage: true,
                },
              },
            },
          })
          .then((e) => e?.group?.displayImage);
      }
      if (type === NOTIFICATION_TYPE.INVITEACCEPTED) {
        icon = await this.prisma.groupMember
          .findFirst({
            where: {
              id: refKey,
            },
            select: {
              group: {
                select: {
                  displayImage: true,
                },
              },
            },
          })
          .then((e) => e?.group?.displayImage);
      }
      if (type === NOTIFICATION_TYPE.COMMENT) {
        icon = await this.prisma.comment
          .findFirst({
            where: {
              id: refKey,
            },
            select: {
              nft: {
                select: {
                  image: true,
                },
              },
            },
          })
          .then((e) => e?.nft?.image);
      }
      if (type === NOTIFICATION_TYPE.COMMENTLIKE) {
        icon = await this.prisma.commentlike
          .findFirst({
            where: {
              id: refKey,
            },
            select: {
              comment: {
                select: {
                  nft: {
                    select: {
                      image: true,
                    },
                  },
                },
              },
            },
          })
          .then((e) => e?.comment?.nft?.image);
      }
      if (type === NOTIFICATION_TYPE.COMMENTREPLIES) {
        icon = await this.prisma.commentreply
          .findFirst({
            where: {
              id: refKey,
            },
            select: {
              comment: {
                select: {
                  nft: {
                    select: {
                      image: true,
                    },
                  },
                },
              },
            },
          })
          .then((e) => e?.comment?.nft?.image);
      }
      if (type === NOTIFICATION_TYPE.LIKE) {
        icon = await this.prisma.like
          .findFirst({
            where: {
              id: refKey,
            },
            select: {
              nft: {
                select: {
                  image: true,
                },
              },
            },
          })
          .then((e) => e?.nft?.image);
      }
      if (type === NOTIFICATION_TYPE.RATENFT) {
        icon = await this.prisma.rateNft
          .findFirst({
            where: {
              id: refKey,
            },
            select: {
              nft: {
                select: {
                  image: true,
                },
              },
            },
          })
          .then((e) => e?.nft?.image);
      }
      if (type === NOTIFICATION_TYPE.FOLLOW) {
        icon = await this.prisma.follow
          .findFirst({
            where: {
              id: refKey,
            },
            select: {
              followerProfile: {
                select: {
                  profilePicture: true,
                },
              },
            },
          })
          .then((e) => e?.followerProfile?.profilePicture);
      }
      return icon;
    } catch (error) {}
  }
}
