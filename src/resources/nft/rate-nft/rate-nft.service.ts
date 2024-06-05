import { BadRequestException, Injectable, InternalServerErrorException } from '@nestjs/common';
import { Prisma, RATING } from '@prisma/client';
import { DEFAULT_PAGINATION, notificationMessageBuilder, NOTIFICATION_TYPE } from 'src/common/constants';
import { PrismaService } from 'src/shared/prisma/prisma.service';
import { SessionService } from 'src/shared/session/session.service';
import { CreateRateNftInput } from './dto/create-rate-nft.input';
import { FindManyRateNftDto } from './dto/find-many-rate-nfts.dto';
import { UpdateRateNftInput } from './dto/update-rate-nft.input';
import { subDays } from 'date-fns';
import { NotificationManagerService } from 'src/shared/notification-manager/notification-manager.service';
import { CreateNotificationInput } from 'src/resources/user/notification/dto/create-notification.input';
import { RewardsService } from 'src/shared/rewards/rewards.service';
import { counters } from 'sharp';

@Injectable()
export class RateNftService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly session: SessionService,
    private readonly notificationManager: NotificationManagerService,
    private readonly rewardService: RewardsService,
  ) { }
  async create(createRateNftInput: CreateRateNftInput) {
    try {
      const userName = this.session.getUserName();
      const createruserId = this.session.getUserId();
      const { nftId, rating } = createRateNftInput;
      const profileId = this.session.getUserProfileId();
      console.log(profileId);
      const currentDay = new Date();
      const yesteday = subDays(new Date(), 1);

      const check = await this.prisma.rateNft.findFirst({
        where: {
          nftId,
          profileId,
          deleted: false,
        },
        select: {
          id: true,
        },
      });
      if (check) {
        throw new BadRequestException('NFT already rated');
      }

      const swipes = await this.prisma.rateNft.findFirst({
        where: {
          profileId,
          deleted: false,
          createdAt: {
            lte: currentDay,
            gt: yesteday,
          },
        },
        include: {
          profile: {
            select: {
              swipe: true,
            }
          }
        }

      }).then((e) => e?.profile?.swipe)
      if (swipes == 0) {
        throw new InternalServerErrorException('You are out of swipes,please come after 24hrs or buy it by our market place');
      }



      if (swipes <= 100) {
        const deductSwipe = await this.prisma.profile.update(
          {
            where: {
              id: profileId,
            },
            data: {
              swipe: { decrement: 1 }
            }
          }
        )
      }

      const rateNft = await this.prisma.rateNft.create({
        data: {
          nftId,
          profileId,
          rating,
        },
      });
      const userId = await this.prisma.nft
        .findFirst({
          where: {
            id: nftId,
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
        message: notificationMessageBuilder.rate(userName),
        refKey: rateNft?.id,
        title: notificationMessageBuilder.rate(userName),
        type: NOTIFICATION_TYPE.RATENFT,
        createdBy: createruserId,
      };
      await this.notificationManager.create(createNotificationInput);
      await this.rewardService.assign(nftId);
      return rateNft;
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }

  async findAll(findManyRateNftDto: FindManyRateNftDto) {
    try {
      const { filter, pagination } = findManyRateNftDto;
      const profileId = this.session.getUserProfileId();
      const where: Prisma.RateNftWhereInput = {
        profileId,
        deleted: false,
      };
      if (filter) {
        if (filter.rating) {
          where['rating'] = filter.rating;
        }
        if (filter.nftTitle) {
          where.AND = {
            nft: {
              title: {
                search: filter.nftTitle,
              },
            },
          };
        }
      }
      const data = await this.prisma.rateNft.findMany({
        skip: (pagination?.page - 1) * pagination?.limit || DEFAULT_PAGINATION.PAGE,
        take: +pagination?.limit || DEFAULT_PAGINATION.PAGE_SIZE,
        where,
      });
      const count = await this.prisma.rateNft.count({ where });
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

  async populateNft(nftId: string) {
    try {
      return await this.prisma.nft.findFirst({
        where: {
          id: nftId,
          deleted: false,
        },
      });
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }

  async populateProfile(profileId: string) {
    try {
      return await this.prisma.profile.findFirst({
        where: {
          id: profileId,
          deleted: false,
        },
      });
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }

  async ratedNFTcount() {
    const profileId = this.session.getUserProfileId();
    const currentDay = new Date();
    const yesteday = subDays(new Date(), 1);
    const count = await this.prisma.rateNft.count({
      where: {
        profileId,
        deleted: false,
        createdAt: {
          lte: currentDay,
          gt: yesteday,
        },
      },
    });
    return count;
  }

  async notification_Rate(refKey: string) {
    try {
      const rateNotification = await this.prisma.rateNft.findFirst({
        where: {
          id: refKey,
          deleted: false,
        },
      });
      return rateNotification;
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }


  // async mostRatedNft() {
  //   const nft = await this.prisma.rateNft.findMany(
  //     {
  //       where: {
  //         rating: 'LIKE',
  //       },
  //       orderBy: [{ ratingCount: Prisma.SortOrder.desc }],
  //       groupBy: { nftId },
  //       select: {
  //         nftId: true,
  //         ratingCount: `COUNT("rating")`,
  //       },
  //     }
  //   )
  // }
  update(id: number, updateRateNftInput: UpdateRateNftInput) {
    return `This action updates a #${id} rateNft`;
  }

  remove(id: number) {
    return `This action removes a #${id} rateNft`;
  }


  handleSwipe(createRateNftInput: CreateRateNftInput) {
    const { nftId, rating } = createRateNftInput;












  }















}
