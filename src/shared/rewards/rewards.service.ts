import { Injectable } from '@nestjs/common';
import { SessionService } from '../session/session.service';
import { PrismaService } from '../prisma/prisma.service';
import { RATING } from '@prisma/client';

@Injectable()
export class RewardsService {
  constructor(private readonly session: SessionService, private readonly prisma: PrismaService) {}

  async assign(nftId: string) {
    const profileId: string = this.session.getUserProfileId();
    const positiveCount: number = await this.prisma.rateNft.count({
      where: {
        nftId,
        deleted: false,
        rating: RATING.LIKE,
      },
    });
    const totalCount: number = await this.prisma.rateNft.count({
      where: {
        nftId,
        deleted: false,
      },
    });
    const percentage: number = (positiveCount / totalCount) * 100;
    if (percentage >= 70 && totalCount >= 10) {
      if (totalCount === 10) {
        const profileIds: string[] = await this.prisma.rateNft
          .findMany({
            where: {
              nftId,
              deleted: false,
            },
            select: {
              profileId: true,
            },
          })
          .then((e) => e?.map((x) => x?.profileId));
        await this.prisma.profile.updateMany({
          where: {
            id: {
              in: profileIds,
            },
          },
          data: {
            coins: { increment: 1 },
            points: { increment: 1 },
          },
        });
        return true;
      }
      await this.prisma.profile.update({
        where: {
          id: profileId,
        },
        data: {
          coins: { increment: 1 },
          points: { increment: 1 },
        },
      });
      return true;
    }
  }
}
