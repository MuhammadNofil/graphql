import { BadRequestException, Injectable, InternalServerErrorException, Logger } from '@nestjs/common';
import { Prisma, RATING } from '@prisma/client';
import { BACKEND_URL, BASE_URL, DEFAULT_PAGINATION } from 'src/common/constants';
import { PaginationDto } from 'src/common/pagination.dto';
import { FileService } from 'src/shared/file/file.service';
import { PrismaService } from 'src/shared/prisma/prisma.service';
import { SessionService } from 'src/shared/session/session.service';
import { NftImpressionService } from './analytics/nft-impression/nft-impression.service';
import { NftViewService } from './analytics/nft-view/nft-view.service';
import { CreateNftInput } from './dto/create-nft.input';
import { FindManyNftDto } from './dto/find-many-nfts.dto';
import { FindRecentNftDto } from './dto/find-recent-nft.dto';
import { UpdateNftInput } from './dto/update-nft.input';
import { Nft } from './entities/nft.entity';
import { LikeService } from './like/like.service';
import { filterNftInputArgs } from './report-nft/dto/filter-nft-by-choice.dto';
import { FindAllProfileNftsDto } from './report-nft/dto/find-all-profile-nfts.dto';
import * as _ from 'lodash';
import { Profile } from '../user/profile/entities/profile.entity';
import { JsonHelperService } from 'src/shared/json-helper/json-helper.service';
import { CompressionHelperService } from 'src/shared/compression-helper/compression-helper.service';
@Injectable()
export class NftService {
  constructor(
    private readonly session: SessionService,
    private readonly prisma: PrismaService,
    private readonly likeService: LikeService,
    private readonly file: FileService,
    private readonly nftViewService: NftViewService,
    private readonly nftImpressionService: NftImpressionService,
    private readonly jsonHelper: JsonHelperService,
    private readonly compression: CompressionHelperService,
  ) {}
  logger = new Logger(NftService.name);

  async create(createNftInput: CreateNftInput) {
    try {
      const { image: picture, ...rest } = createNftInput;
      const profileId = this.session.getUserProfileId();
      const walletId = this.session.getUserWalletId();
      if (!walletId) {
        throw new BadRequestException('No wallet found');
      }
      const userId = this.session.getUserId();
      const userName = this.session.getUserName();
      // //TODO: pinata starts from here
      // const { metadata, hash } = await this.jsonHelper.ipfsPinata(rest.mediaHash);
      // const compressFile = await this.compression.compressImage(metadata.image, 50);
      // const image = (await this.file.uploadBufferFile(compressFile, '/nft', userName, metadata.media.mimeType)).url;
      // //TODO: pinata ends from here
      const image = (await this.file.uploadFileGenericBase64(picture, userId, 'nft')).url;
      const nft = await this.prisma.nft.create({
        data: {
          profileId,
          walletId,
          ...rest,
          image,
        },
      });
      return nft;
    } catch (error) {
      console.log(error);
      if (error.code == 'P2002') {
        if (error.meta.target.includes('mediaHash')) {
          error = `NFT with media hash:${createNftInput?.mediaHash} already exists`;
        }
      }
      throw new InternalServerErrorException(error);
    }
  }

  async findAll(findManyNftDto: FindManyNftDto) {
    //TODO:this api brings nft of the session profile's
    try {
      const { filter, pagination } = findManyNftDto;
      const profileId = this.session.getUserProfileId();
      const walletId = this.session.getUserWalletId();
      if (!walletId) {
        throw new BadRequestException('Please add wallet first to access NFTs');
      }
      const nftArgs: Prisma.NftFindManyArgs = {
        skip: (pagination?.page - 1) * pagination?.limit || DEFAULT_PAGINATION.PAGE,
        take: +pagination?.limit || DEFAULT_PAGINATION.PAGE_SIZE,
      };
      nftArgs.where = {
        profileId,
        walletId,
        deleted: false,
      };
      if (filter) {
        if (filter.title) {
          nftArgs.where.title = {
            contains: filter.title.split(' ').join(' & '),
            mode: 'insensitive',
          };
        }
        if (filter.description) {
          nftArgs.where.description = {
            search: filter.description.split(' ').join(' & '),
            mode: 'insensitive',
          };
        }
        if (filter.category) {
          nftArgs.where.category = {
            hasSome: filter.category,
          };
        }
      }
      const data = await this.prisma.nft.findMany(nftArgs);
      const count = await this.prisma.nft.count({ where: nftArgs.where });
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
      console.log(error);
      throw new InternalServerErrorException(error);
    }
  }

  async nftToRate(pagination: PaginationDto) {
    try {
      const profileId = this.session.getUserProfileId();
      console.log('🚀 ~ file: nft.service.ts ~ line 93 ~ NftService ~ nftToRate ~ profileId', profileId);
      const where: Prisma.NftWhereInput = {
        deleted: false,
        // AND: {
        rateNft: {
          every: {
            profileId: {
              not: profileId,
            },
          },
        },
        profile: {
          NOT: {
            blocked: {
              some: {
                profileId,
                deleted: false,
                isBlocked: true,
              },
            },
          },
        },
        // },
        // rateNft: {
        // every: {
        //   NOT: {
        //     profileId,
        //   },
        // },
        // },
      };
      const data = await this.prisma.nft.findMany({
        where,
        orderBy: [{ createdAt: 'asc' }],
        skip: (pagination?.page - 1) * pagination?.limit || DEFAULT_PAGINATION.PAGE,
        take: +pagination?.limit || DEFAULT_PAGINATION.PAGE_SIZE,
      });
      const nftIds = data.map((e) => e.id);
      await this.nftImpressionService.createMany({ nftIds });
      const count = await this.prisma.nft.count({ where });
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

  async findAllProfileNfts(findAllProfileNftsDto: FindAllProfileNftsDto) {
    const { filter, pagination, profileId } = findAllProfileNftsDto;
    const userProfileId = this.session.getUserProfileId();
    const nftArgs: Prisma.NftFindManyArgs = {
      where: {
        profileId,
        deleted: false,
        profile: {
          NOT: {
            blocked: {
              some: {
                profileId: userProfileId,
                deleted: false,
                isBlocked: true,
              },
            },
          },
        },
      },

      skip: (pagination?.page - 1) * pagination?.limit || DEFAULT_PAGINATION.PAGE,
      take: +pagination?.limit || DEFAULT_PAGINATION.PAGE_SIZE,
    };
    if (filter) {
      if (filter.title) {
        filter.title = filter.title.replace(/\s+$/, '');
        nftArgs.where.title = {
          contains: filter.title.split(' ').join(' & '),
          mode: 'insensitive',
        };
      }
      if (filter.description) {
        nftArgs.where.description = {
          search: filter.description.split(' ').join(' & '),
          mode: 'insensitive',
        };
      }
      if (filter.category) {
        nftArgs.where.category = {
          hasSome: filter.category,
        };
      }
    }
    const count = await this.prisma.nft.count({ where: nftArgs.where });
    const data = await this.prisma.nft.findMany(nftArgs);
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

  async getOne(nftId: string): Promise<Partial<Nft>> {
    try {
      const nft = await this.prisma.nft.findFirst({
        where: { id: nftId, deleted: false },
      });
      console.log('🚀 ~ file: nft.service.ts:152 ~ NftService ~ getOne ~ nft', nft);
      if (nft) {
        await this.nftViewService.create({ nftId: nft?.id });
      }
      return nft;
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }

  async likesCount(nftId: string) {
    return this.likeService.countLikes(nftId);
  }

  async populateProfile(profileId: string) {
    return await this.prisma.profile.findFirst({
      where: {
        id: profileId,
      },
    });
  }

  async populateWallet(walletId: string) {
    try {
      const wallet = await this.prisma.wallet.findFirst({
        where: {
          id: walletId,
          deleted: false,
        },
      });
      return wallet;
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }

  async populateComments(id: string) {
    const comments = await this.prisma.comment.findMany({
      where: {
        nftId: id,
        deleted: false,
      },
    });
    return comments;
  }

  async commentCount(nftId: string) {
    const count = await this.prisma.comment.count({
      where: {
        nftId,
        deleted: false,
      },
    });
    return count;
  }

  async countNftView(id: string) {
    try {
      return await this.nftViewService.countByNftId(id);
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }

  async countNftImpression(id: string) {
    try {
      return await this.nftImpressionService.countByNftId(id);
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }

  // async recentNfts(findRecentDto: FindRecentNftDto) {
  //   try {
  //     const { pagination, filter } = findRecentDto;
  //     const profileId = this.session.getUserProfileId();
  //     const walletId = this.session.getUserWalletId();
  //     if (!walletId) {
  //       throw new BadRequestException('No wallet found');
  //     }
  //     const where: Prisma.NftWhereInput = {
  //       profileId,
  //       walletId,
  //       deleted: false,
  //     };

  //     let orderBy: Prisma.NftFindManyArgs['orderBy'];

  //     if (filter) {
  //       if (filter.recent) {
  //         orderBy = [{ createdAt: Prisma.SortOrder.desc }];
  //         const data = await this.prisma.nft.findMany({
  //           where,
  //           orderBy,

  //           skip: (pagination?.page - 1) * pagination?.limit || DEFAULT_PAGINATION.PAGE,
  //           take: +pagination?.limit || DEFAULT_PAGINATION.PAGE_SIZE,
  //         });
  //         const count = await this.prisma.nft.count({ where });
  //         return {
  //           data,
  //           metadata: {
  //             page: +pagination?.page || DEFAULT_PAGINATION.PAGE + 1,
  //             limit: +pagination?.limit || DEFAULT_PAGINATION.PAGE_SIZE,
  //             total: {
  //               pages: Math.ceil(count / (+pagination?.limit || DEFAULT_PAGINATION.PAGE_SIZE)),
  //               records: count,
  //             },
  //           },
  //         };
  //       }

  //       if (filter.category) {
  //         const data = await this.prisma.nft.findMany({
  //           where: {
  //             category: {
  //               hasSome: filter.category,
  //             },
  //           },

  //           skip: (pagination?.page - 1) * pagination?.limit || DEFAULT_PAGINATION.PAGE,
  //           take: +pagination?.limit || DEFAULT_PAGINATION.PAGE_SIZE,
  //         });
  //         const count = await this.prisma.nft.count({ where });
  //         return {
  //           data,
  //           metadata: {
  //             page: +pagination?.page || DEFAULT_PAGINATION.PAGE + 1,
  //             limit: +pagination?.limit || DEFAULT_PAGINATION.PAGE_SIZE,
  //             total: {
  //               pages: Math.ceil(count / (+pagination?.limit || DEFAULT_PAGINATION.PAGE_SIZE)),
  //               records: count,
  //             },
  //           },
  //         };
  //       }
  //       if (filter.type) {
  //         const data = await this.prisma.nft.findMany({
  //           where: {
  //             type: {
  //               equals: filter.type,
  //             },
  //           },
  //           skip: (pagination?.page - 1) * pagination?.limit || DEFAULT_PAGINATION.PAGE,
  //           take: +pagination?.limit || DEFAULT_PAGINATION.PAGE_SIZE,
  //         });
  //         const count = await this.prisma.nft.count({ where });
  //         return {
  //           data,
  //           metadata: {
  //             page: +pagination?.page || DEFAULT_PAGINATION.PAGE + 1,
  //             limit: +pagination?.limit || DEFAULT_PAGINATION.PAGE_SIZE,
  //             total: {
  //               pages: Math.ceil(count / (+pagination?.limit || DEFAULT_PAGINATION.PAGE_SIZE)),
  //               records: count,
  //             },
  //           },
  //         };
  //       }
  //     }

  //     const data = await this.prisma.nft.findMany({
  //       where,
  //       skip: (pagination?.page - 1) * pagination?.limit || DEFAULT_PAGINATION.PAGE,
  //       take: +pagination?.limit || DEFAULT_PAGINATION.PAGE_SIZE,
  //     });
  //     const count = await this.prisma.nft.count({ where });
  //     return {
  //       data,
  //       metadata: {
  //         page: +pagination?.page || DEFAULT_PAGINATION.PAGE + 1,
  //         limit: +pagination?.limit || DEFAULT_PAGINATION.PAGE_SIZE,
  //         total: {
  //           pages: Math.ceil(count / (+pagination?.limit || DEFAULT_PAGINATION.PAGE_SIZE)),
  //           records: count,
  //         },
  //       },
  //     };
  //   } catch (error) {}
  // }

  async nftFindMnay(findRecentDto: FindRecentNftDto) {
    try {
      const profileId = this.session.getUserProfileId();
      const { filter, pagination } = findRecentDto;

      const findmanyArgs: Prisma.NftFindManyArgs = {
        where: {
          deleted: false,
          profile: {
            NOT: {
              blocked: {
                some: {
                  profileId,
                  deleted: false,
                  isBlocked: true,
                },
              },
            },
          },
        },
        skip: (pagination?.page - 1) * pagination?.limit || DEFAULT_PAGINATION.PAGE,
        take: +pagination?.limit || DEFAULT_PAGINATION.PAGE_SIZE,
      };
      if (filter) {
        if (filter.recent) {
          findmanyArgs.orderBy = [{ createdAt: Prisma.SortOrder.desc }];
        }
        if (filter.category) {
          findmanyArgs.where.category = {
            hasSome: filter.category,
          };
        }
        if (filter.type) {
          findmanyArgs.where.type = filter.type;
        }
        if (filter.isFeatured) {
          const currentDate = new Date();
          findmanyArgs.where.featureDate = {
            gte: currentDate,
          };
        }
      }
      const data = await this.prisma.nft.findMany(findmanyArgs);
      const count = await this.prisma.nft.count({ where: findmanyArgs?.where });
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
      this.logger.error(error);
      throw new InternalServerErrorException(error);
    }
  }

  async populateGroupPost(id: string) {
    try {
      const GroupPost = await this.prisma.groupPost.findMany({
        where: {
          nftId: id,
          deleted: false,
        },
      });
      return GroupPost;
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }

  async notification_Nft(refKey: string) {
    const nftNotification = await this.prisma.nft
      .findFirst({
        where: {
          id: refKey,
          deleted: false,
        },
      })
      .then((e) => e.id);
    return nftNotification;
  }

  async findNftLikeFlag(nftId: string) {
    const profileId = this.session.getUserProfileId();
    const data = await this.prisma.like
      .findFirst({
        where: {
          nftId,
          profileId,
        },
        select: {
          liked: true,
        },
      })
      .then((e) => e?.liked);
    console.log(data);
    if (data) {
      return true;
    } else {
      return false;
    }
  }

  async isLikedFlag(nftId: string) {
    return await this.likeService.isLikedFlag(nftId);
  }

  async findOne(nftId: string) {
    return await this.prisma.nft.findFirst({
      where: {
        id: nftId,
        deleted: false,
      },
    });
  }

  async topRatedNfts(pagination: PaginationDto) {
    try {
      const profileId = this.session.getUserProfileId();
      const where: Prisma.NftWhereInput = {
        deleted: false,
        profile: {
          NOT: {
            blocked: {
              some: {
                profileId,
                deleted: false,
                isBlocked: true,
              },
            },
          },
          // AND: {
          //   NOT: {
          //     blocker: {
          //       some: {
          //         profileId
          //       }
          //     }
          //   }
          // }
        },

        rateNft: {
          some: {
            rating: RATING.LIKE,
          },
        },
      };
      const data = await this.prisma.nft.findMany({
        orderBy: {
          rateNft: {
            _count: 'desc',
          },
        },
        where,
        skip: (pagination?.page - 1) * pagination?.limit || DEFAULT_PAGINATION.PAGE,
        take: +pagination?.limit || DEFAULT_PAGINATION.PAGE_SIZE,
      });
      const count = await this.prisma.nft.count({ where });
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

  update(id: number, updateNftInput: UpdateNftInput) {
    return `This action updates a #${id} nft`;
  }

  remove(id: number) {
    return `This action removes a #${id} nft`;
  }

  async filterNft(filterNftByChoice: filterNftInputArgs) {
    const profileId = this.session.getUserProfileId();
    const { filter, pagination } = filterNftByChoice;
    const findManyArgs: Prisma.NftFindManyArgs = {
      where: {
        deleted: false,
        profile: {
          NOT: {
            blocked: {
              some: {
                profileId,
                deleted: false,
                isBlocked: true,
              },
            },
          },
        },
      },
      skip: (pagination?.page - 1) * pagination?.limit || DEFAULT_PAGINATION.PAGE,
      take: +pagination?.limit || DEFAULT_PAGINATION.PAGE_SIZE,
    };

    if (filter) {
      if (filter.title) {
        filter.title = filter.title.replace(/\s+$/, '');
        findManyArgs.where.title = {
          contains: filter.title.split(' ').join(' & '),
          mode: 'insensitive',
        };
      }
      if (filter.category) {
        findManyArgs.where.category = {
          hasSome: filter.category,
        };
      }
      if (filter.mostViewed) {
        findManyArgs.orderBy = [
          {
            NftView: {
              _count: 'desc',
            },
          },
        ];
      }
      if (filter.trending) {
        findManyArgs.orderBy = [
          {
            rateNft: {
              _count: 'desc',
            },
          },
        ];
      }
    }
    // findManyArgs?.where.rateNft.some.rating = RATING.LIKE

    const data = await this.prisma.nft.findMany(findManyArgs);
    const count = await this.prisma.nft.count({ where: findManyArgs?.where });
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

  async nftsignature(nftId: string) {
    const check = await this.prisma.nft.findFirst({
      where: {
        id: nftId,
        deleted: false,
      },
    });
    if (check) {
      const encode = Buffer.from(nftId).toString('base64');
      const link = `${BACKEND_URL}/nft?signature=${encode}`;
      return link;
    }
  }

  async getNftIdViaSignature(signature: string) {
    try {
      const decode = Buffer.from(signature, 'base64').toString('ascii');

      const link = `${BASE_URL}/?resource=nft&id=${decode}`;
      return link;
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }

  async getNftViaLink(id: string) {
    try {
      const nft = await this.prisma.nft.findFirst({
        where: {
          id,
          deleted: false,
        },
      });
      return nft;
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }

  async stats(nftId: string) {
    const total = await this.prisma.rateNft.count({
      where: {
        nftId,
        deleted: false,
      },
    });
    const positiveCount = await this.prisma.rateNft.count({
      where: {
        nftId,
        rating: RATING.LIKE,
        deleted: false,
      },
    });

    if (total === 0) {
      return {
        positive: 0,
        negative: 0,
        total: 0,
      };
    } else {
      const positivePercent = (positiveCount / total) * 100;
      const negativePercent = ((total - positiveCount) / total) * 100;
      return {
        positive: positivePercent,
        negative: negativePercent,
        total,
      };
    }
  }

  async populateRateNft(nftId: string) {
    try {
      const rateNft = await this.prisma.rateNft.findMany({
        where: {
          nftId,
          deleted: false,
        },
      });
      return rateNft;
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }
}
