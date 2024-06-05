import { BadRequestException, Injectable, InternalServerErrorException, Logger } from '@nestjs/common';
import { PrismaService } from 'src/shared/prisma/prisma.service';
import { SessionService } from 'src/shared/session/session.service';
import { CreateManyNftImpressionInput } from './dto/create-many-nft-impression.input';
import { CreateNftImpressionInput } from './dto/create-nft-impression.input';
import { UpdateNftImpressionInput } from './dto/update-nft-impression.input';
import { addDays, subDays } from 'date-fns';
import { DEFAULT_PAGINATION } from 'src/common/constants';
import { FindManyNftViewDto } from '../nft-view/dto/find-many-nfts.dto';
import { Prisma } from '@prisma/client';

@Injectable()
export class NftImpressionService {
  constructor(private readonly prisma: PrismaService, private readonly session: SessionService) {}
  logger = new Logger(NftImpressionService.name);
  async create(createNftImpressionInput: CreateNftImpressionInput) {
    try {
      const profileId = this.session.getUserProfileId();
      const yesteday = subDays(new Date(), 1);
      const nftImpression = await this.prisma.nftImpression.findFirst({
        where: {
          deleted: false,
          profileId,
          createdAt: {
            lte: yesteday,
          },
          ...createNftImpressionInput,
        },
      });
      if (nftImpression) {
        return nftImpression;
      }
      const impression = await this.prisma.nftImpression.create({
        data: {
          profileId,
          ...createNftImpressionInput,
        },
      });
      return impression;
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }

  async createMany(createManyNftImpressionInput: CreateManyNftImpressionInput) {
    try {
      const yesteday = subDays(new Date(), 1);
      const profileId = this.session.getUserProfileId();
      const { nftIds } = createManyNftImpressionInput;
      const filterdNftId = await this.prisma.nftImpression
        .findMany({
          distinct: ['nftId'],
          where: {
            profileId,
            deleted: false,
            nftId: {
              in: nftIds,
            },
            createdAt: {
              gte: yesteday,
            },
          },
          select: {
            nftId: true,
          },
        })
        .then((e) => e.map((x) => x.nftId));
      const difference = nftIds.filter((x) => !filterdNftId.includes(x));
      const impression = await this.prisma.nftImpression.createMany({
        data: difference.map((d) => {
          return {
            profileId,
            nftId: d,
          };
        }),
      });
      return true;
    } catch (error) {
      this.logger.error(error);
      throw new InternalServerErrorException(error);
    }
  }

  // findAll() {
  //   return `This action returns all nftImpression`;
  // }

  async findAll(findManyNftViewDto: FindManyNftViewDto) {
    try {
      const { filter, pagination } = findManyNftViewDto;
      const profileId = await this.session.getUserProfileId();
      const where: Prisma.NftImpressionWhereInput = {
        deleted: false,
        profileId,
      };
      if (filter) {
        if (filter.nftId) {
          where.nftId = filter.nftId;
        }
        if (filter.before && filter.after) {
          where.createdAt = {
            lte: filter.before,
            gte: filter.after,
          };
        }
        if (filter.after && !filter.before) {
          where.createdAt = {
            gte: filter.after,
          };
        }
        if (filter.before && filter.after) {
          where.createdAt = {
            lte: filter.before,
          };
        }
      }
      const data = await this.prisma.nftImpression.findMany({
        where,
        orderBy: [{ createdAt: 'desc' }],
        skip: (pagination?.page - 1) * pagination?.limit || DEFAULT_PAGINATION.PAGE,
        take: +pagination?.limit || DEFAULT_PAGINATION.PAGE_SIZE,
      });
      const count = await this.prisma.nftImpression.count({ where });
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

  async countByNftId(nftId: string): Promise<number> {
    try {
      return await this.prisma.nftImpression.count({
        where: {
          nftId,
          deleted: false,
        },
      });
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }

  async countByProfileId(profileId: string): Promise<number> {
    try {
      return await this.prisma.nftImpression.count({
        where: {
          profileId,
          deleted: false,
        },
      });
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

  findOne(id: number) {
    return `This action returns a #${id} nftImpression`;
  }

  update(id: number, updateNftImpressionInput: UpdateNftImpressionInput) {
    return `This action updates a #${id} nftImpression`;
  }

  remove(id: number) {
    return `This action removes a #${id} nftImpression`;
  }
}
