import { BadRequestException, Injectable, InternalServerErrorException, Logger } from '@nestjs/common';
import { PrismaService } from 'src/shared/prisma/prisma.service';
import { SessionService } from 'src/shared/session/session.service';
import { CreateNftViewInput } from './dto/create-nft-view.input';
import { UpdateNftViewInput } from './dto/update-nft-view.input';
import { addDays, subDays } from 'date-fns';
import { CreateManyNftViewInput } from './dto/create-many-nft-view.input';
import { FindManyNftViewDto } from './dto/find-many-nfts.dto';
import { Prisma } from '@prisma/client';
import { DEFAULT_PAGINATION } from 'src/common/constants';

@Injectable()
export class NftViewService {
  constructor(private readonly prisma: PrismaService, private readonly session: SessionService) {}
  logger = new Logger(NftViewService.name);

  async create(createNftViewInput: CreateNftViewInput) {
    console.log('🚀 ~ file: nft-view.service.ts:16 ~ NftViewService ~ create ~ createNftViewInput', createNftViewInput);
    try {
      const profileId = this.session.getUserProfileId();
      const yesteday = subDays(new Date(), 1);
      const nftImpression = await this.prisma.nftView.findFirst({
        where: {
          deleted: false,
          profileId,
          createdAt: {
            gte: yesteday,
          },
          ...createNftViewInput,
        },
      });
      if (nftImpression) {
        return nftImpression;
      }
      const impression = await this.prisma.nftView.create({
        data: {
          profileId,
          ...createNftViewInput,
        },
      });
      return impression;
    } catch (error) {
      this.logger.error(error);
      throw new InternalServerErrorException(error);
    }
  }

  async createMany(createManyNftViewInput: CreateManyNftViewInput) {
    try {
      const yesteday = subDays(new Date(), 1);
      const profileId = this.session.getUserProfileId();
      const { nftIds } = createManyNftViewInput;
      const filterdNftId = await this.prisma.nftView
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
      if (!!filterdNftId?.length) {
        return true;
      }
      const impression = await this.prisma.nftView.createMany({
        data: filterdNftId.map((e) => {
          return {
            profileId,
            nftId: e,
          };
        }),
      });
      return true;
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }

  async countByNftId(nftId: string): Promise<number> {
    try {
      return await this.prisma.nftView.count({
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
      return await this.prisma.nftView.count({
        where: {
          profileId,
          deleted: false,
        },
      });
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }

  // async populateProfile(profileId: string) {
  //   try {
  //     const profile = await this.prisma.profile.findFirst({
  //       where: {
  //         deleted: false,
  //         id: profileId,
  //       },
  //     });
  //     if (!profile) {
  //       throw new BadRequestException('Profile not found');
  //     }
  //     return profile;
  //   } catch (error) {
  //     throw new InternalServerErrorException(error);
  //   }
  // }

  // async populateNft(nftId: string) {
  //   try {
  //     const Nft = await this.prisma.nft.findFirst({
  //       where: {
  //         deleted: false,
  //         id: nftId,
  //       },
  //     });
  //     if (!Nft) {
  //       throw new BadRequestException('Nft not found');
  //     }
  //     return Nft;
  //   } catch (error) {
  //     throw new InternalServerErrorException(error);
  //   }
  // }

  async findAll(findManyNftViewDto: FindManyNftViewDto) {
    try {
      const { filter, pagination } = findManyNftViewDto;
      const profileId = await this.session.getUserProfileId();
      const where: Prisma.NftViewWhereInput = {
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
      const data = await this.prisma.nftView.findMany({
        where,
        orderBy: [{ createdAt: 'desc' }],
        skip: (pagination?.page - 1) * pagination?.limit || DEFAULT_PAGINATION.PAGE,
        take: +pagination?.limit || DEFAULT_PAGINATION.PAGE_SIZE,
      });
      const count = await this.prisma.nftView.count({ where });
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

  findOne(id: number) {
    return `This action returns a #${id} nftView`;
  }

  update(id: number, updateNftViewInput: UpdateNftViewInput) {
    return `This action updates a #${id} nftView`;
  }

  remove(id: number) {
    return `This action removes a #${id} nftView`;
  }
}
