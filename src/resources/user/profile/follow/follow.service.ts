import { BadRequestException, Injectable, InternalServerErrorException } from '@nestjs/common';
import { DEFAULT_PAGINATION, notificationMessageBuilder, NOTIFICATION_TYPE } from 'src/common/constants';
import { NotificationManagerService } from 'src/shared/notification-manager/notification-manager.service';
import { PrismaService } from 'src/shared/prisma/prisma.service';
import { SessionService } from 'src/shared/session/session.service';
import { CreateNotificationInput } from '../../notification/dto/create-notification.input';
import { CreateFollowInput } from './dto/create-follow.input';
import { FindManyFollowDto } from './dto/find-many-follow.dto';
import { UpdateFollowInput } from './dto/update-follow.input';

@Injectable()
export class FollowService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly session: SessionService,
    private readonly notificationManager: NotificationManagerService,
  ) {}

  async follow(createFollowInput: CreateFollowInput) {
    try {
      const userName = this.session.getUserName();
      const createruserId = this.session.getUserId();
      const { followedProfileId } = createFollowInput;
      const followerProfileId = this.session.getUserProfileId();
      if (followerProfileId === followedProfileId) {
        throw new BadRequestException(`You cannot follow yourself`);
      }
      const check = await this.prisma.follow.findFirst({
        where: {
          followerProfileId,
          followedProfileId,
          deleted: false,
        },
      });
      if (check) {
        if (check.isFollowed) {
          throw new BadRequestException(`you already follow this profile`);
        }
        const update = await this.prisma.follow.update({
          where: {
            id: check.id,
          },
          data: {
            isFollowed: true,
          },
        });
        return update;
      }
      const follow = await this.prisma.follow.create({
        data: {
          followerProfileId: followerProfileId,
          followedProfileId: followedProfileId,
        },
      });
      const userId = await this.prisma.profile
        .findFirst({
          where: {
            id: followedProfileId,
            deleted: false,
          },
          select: {
            userId: true,
          },
        })
        .then((e) => e?.userId);
      const createNotificationInput: CreateNotificationInput = {
        userId,
        message: notificationMessageBuilder.follow(userName),
        refKey: follow?.id,
        title: notificationMessageBuilder.follow(userName),
        type: NOTIFICATION_TYPE.FOLLOW,
        createdBy: createruserId,
      };
      await this.notificationManager.create(createNotificationInput);

      return follow;
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }

  async findAll(findManyFollowDto: FindManyFollowDto) {
    try {
      const { filter, pagination } = findManyFollowDto;
      const followerProfileId = this.session.getUserProfileId();
      const where = {
        followerProfileId,
        deleted: false,
        isFollowed: true,
      };
      if (filter) {
        where['AND'] = {
          followedProfile: {
            name: {
              search: filter.name,
            },
          },
        };
      }
      const data = await this.prisma.follow.findMany({
        where,
        skip: (pagination?.page - 1) * pagination?.limit || DEFAULT_PAGINATION.PAGE,
        take: +pagination?.limit || DEFAULT_PAGINATION.PAGE_SIZE,
      });
      const count = await this.prisma.follow.count({
        where,
      });
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

  async findAllFollower(findManyFollowDto: FindManyFollowDto) {
    try {
      const { filter, pagination } = findManyFollowDto;
      const followedProfileId = this.session.getUserProfileId();
      const where = {
        followedProfileId,
        deleted: false,
        isFollowed: true,
      };
      if (filter) {
        where['AND'] = {
          followerProfile: {
            name: {
              search: filter.name,
            },
          },
        };
      }
      const data = await this.prisma.follow.findMany({
        where,
        skip: (pagination?.page - 1) * pagination?.limit || DEFAULT_PAGINATION.PAGE,
        take: +pagination?.limit || DEFAULT_PAGINATION.PAGE_SIZE,
      });
      const count = await this.prisma.follow.count({
        where,
      });
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

  async populateProfile(id: string) {
    try {
      const profile = await this.prisma.profile.findUnique({
        where: {
          id,
        },
      });
      return profile;
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }

  // findOne(id: number) {
  //   return `This action returns a #${id} follow`;
  // }

  //throws an error if not following the user if you are following it responds with
  async unfollow(updateFollowInput: UpdateFollowInput) {
    try {
      const check = await this.prisma.follow
        .findFirst({
          where: {
            ...updateFollowInput,
            isFollowed: true,
            deleted: false,
          },
          select: {
            id: true,
          },
        })
        .then((e) => e?.id);
      if (!check) {
        throw new InternalServerErrorException('You do not unfollow this user');
      }
      const update = await this.prisma.follow
        .update({
          where: {
            id: check,
          },
          data: {
            isFollowed: false,
          },
          select: {
            followedProfile: {
              select: {
                user: {
                  select: {
                    userName: true,
                  },
                },
              },
            },
          },
        })
        .then((e) => e.followedProfile.user.userName);
      return { message: `You have unfollowed ${update}` };
    } catch (error) {
      console.log(error);
      throw new InternalServerErrorException(error);
    }
  }

  async notification_follow(refKey: string) {
    try {
      const followNotification = await this.prisma.follow.findFirst({
        where: {
          id: refKey,
          deleted: false,
        },
      });
      return followNotification;
    } catch (error) {}
  }
}
