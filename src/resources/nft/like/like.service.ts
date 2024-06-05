import { BadRequestException, Injectable, InternalServerErrorException } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { count } from 'console';
import { DEFAULT_PAGINATION, notificationMessageBuilder, NOTIFICATION_TYPE } from 'src/common/constants';
import { CreateNotificationInput } from 'src/resources/user/notification/dto/create-notification.input';
import { FileService } from 'src/shared/file/file.service';
import { NotificationManagerService } from 'src/shared/notification-manager/notification-manager.service';
import { PrismaService } from 'src/shared/prisma/prisma.service';
import { SessionService } from 'src/shared/session/session.service';
import { CreateLikeInput } from './dto/create-like.input';
import { PaginatedLikedDto } from './dto/paginated-like.dto';

@Injectable()
export class LikeService {
  constructor(
    private readonly session: SessionService,
    private readonly prisma: PrismaService,
    private readonly notificationManager: NotificationManagerService,
  ) {}

  async create(createLikeInput: CreateLikeInput) {
    try {
      const { nftId } = createLikeInput;

      const profileId = this.session.getUserProfileId();
      const userName = this.session.getUserName();
      const check = await this.prisma.like.findFirst({
        where: { profileId, nftId, deleted: false },
      });
      console.log(check);
      const userId: string = await this.prisma.nft
        .findFirst({
          where: {
            id: nftId,
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
      if (check) {
        console.log(check);
        const notificationData: CreateNotificationInput = {
          type: NOTIFICATION_TYPE.LIKE,
          message: notificationMessageBuilder.like(userName),
          title: notificationMessageBuilder.like(userName),
          createdBy: this.session.getUserId(),
          refKey: check?.id,
          userId,
        };
        if (check.liked === true) {
          console.log(check.liked);
          const like = await this.prisma.like.update({
            where: {
              id: check.id,
            },
            data: {
              liked: false, // TODO:A notification functon needed to be created for sending deleted like response
            },
          });

          return like;
        } else {
          const like = await this.prisma.like.update({
            where: {
              id: check.id,
            },
            data: {
              liked: true,
            },
          });
          await this.notificationManager.create(notificationData);
          return like;
        }
      }
      const like = await this.prisma.like.create({
        data: {
          profileId,
          nftId,
        },
      });
      const notificationData: CreateNotificationInput = {
        type: NOTIFICATION_TYPE.LIKE,
        message: notificationMessageBuilder.like(userName),
        title: notificationMessageBuilder.like(userName),
        createdBy: this.session.getUserId(),
        refKey: like?.id,
        userId,
      };
      await this.notificationManager.create(notificationData);
      return like;
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }

  async findAll(nftId: string) {
    try {
      const allLikes = await this.prisma.like.findMany({
        where: { nftId, liked: true, deleted: false },
      });
      return allLikes;
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }

  async findLikes(nftId: string) {
    try {
      const allLikes = await this.prisma.like.count({
        where: { nftId, liked: true, deleted: false },
      });
      return allLikes;
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }

  async countLikes(nftId: string) {
    //TODO: fix naming when returning count use count in name also use this count in entity
    try {
      const allLikes = await this.prisma.like.count({
        where: { nftId, liked: true, deleted: false },
      });
      return allLikes;
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

  // async populatelike(id: string) {
  //   try {
  //     const like = await this.prisma.like.findMany({
  //       where: {
  //         commentId: id,
  //         deleted: false,
  //       },
  //     });
  //     return like;
  //   } catch (error) {
  //     throw new InternalServerErrorException(error);
  //   }
  // }

  async populateComment(commentid: string) {
    try {
      const like = await this.prisma.like.findUnique({
        where: {
          id: commentid,
        },
      });
      return like;
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }

  async notification_Like(refKey: string) {
    try {
      const likeNotification = await this.prisma.like.findFirst({
        where: {
          id: refKey,
          deleted: false,
        },
      });
      return likeNotification;
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }

  async isLikedFlag(nftId: string) {
    const profileId = this.session.getUserProfileId();
    if (!profileId) {
      return false;
    }
    const data = await this.prisma.like.findFirst({
      where: {
        nftId,
        profileId,
        liked: true,
      },
    });

    if (data) {
      return true;
    }
    return false;
  }

  async paginatedLiked(paginatedLikedDto: PaginatedLikedDto) {
    const { pagination, nftId } = paginatedLikedDto;

    const where: Prisma.LikeFindManyArgs = {
      where: {
        nftId,
        liked: true,
      },
      skip: (pagination?.page - 1) * pagination?.limit || DEFAULT_PAGINATION.PAGE,
      take: +pagination?.limit || DEFAULT_PAGINATION.PAGE_SIZE,
    };

    const data = await this.prisma.like.findMany(where);
    const count = await this.prisma.like.count({ where: where?.where });
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
  }

  // findOne(id: number) {
  //   return `This action returns a #${id} like`;
  // }

  // update(id: number, updateLikeInput: UpdateLikeInput) {
  //   return `This action updates a #${id} like`;
  // }

  // remove(id: number) {
  //   return `This action removes a #${id} like`;
  // }
}
