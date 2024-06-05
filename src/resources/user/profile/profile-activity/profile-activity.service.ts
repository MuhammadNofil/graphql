import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { Prisma, RATING } from '@prisma/client';
import { DEFAULT_PAGINATION } from 'src/common/constants';
import { PaginationDto } from 'src/common/pagination.dto';
import { PrismaService } from 'src/shared/prisma/prisma.service';
import { SessionService } from 'src/shared/session/session.service';
import { CreateProfileActivityInput } from './dto/create-profile-activity.input';
import { UpdateProfileActivityInput } from './dto/update-profile-activity.input';

@Injectable()
export class ProfileActivityService {
  constructor(private readonly session: SessionService, private readonly prisma: PrismaService) {}

  // create(createProfileActivityInput: CreateProfileActivityInput) {
  //   return 'This action adds a new profileActivity';
  // }

  async findAll(paginatedDto: PaginationDto) {
    try {
      const { page, limit } = paginatedDto;
      const profileId = this.session.getUserProfileId();
      const where = {
        deleted: false,
        profileId,
      };
      const likeData = await this.prisma.like.findMany({
        where,
        orderBy: [{ createdAt: 'desc' }],
        skip: (page - 1) * limit || DEFAULT_PAGINATION.PAGE,
        take: limit || DEFAULT_PAGINATION.PAGE_SIZE,
      });
      const countLike = await this.prisma.like.count({ where });
      const like = {
        data: likeData,
        metadata: {
          page: page || DEFAULT_PAGINATION.PAGE + 1,
          limit: limit || DEFAULT_PAGINATION.PAGE_SIZE,
          total: {
            pages: Math.ceil(countLike / (limit || DEFAULT_PAGINATION.PAGE_SIZE)),
            records: countLike,
          },
        },
      };
      console.log(like);
      const commentData = await this.prisma.comment.findMany({
        where,
        orderBy: [{ createdAt: 'desc' }],
        skip: (page - 1) * limit || DEFAULT_PAGINATION.PAGE,
        take: limit || DEFAULT_PAGINATION.PAGE_SIZE,
      });
      const countComment = await this.prisma.comment.count({ where });
      const comment = {
        data: commentData,
        metadata: {
          page: page || DEFAULT_PAGINATION.PAGE + 1,
          limit: limit || DEFAULT_PAGINATION.PAGE_SIZE,
          total: {
            pages: Math.ceil(countComment / (limit || DEFAULT_PAGINATION.PAGE_SIZE)),
            records: countComment,
          },
        },
      };

      const rateNftData = await this.prisma.rateNft.findMany({
        where: {
          ...where,
          rating: RATING.LIKE,
        },
        orderBy: [{ createdAt: 'desc' }],
        skip: (page - 1) * limit || DEFAULT_PAGINATION.PAGE,
        take: limit || DEFAULT_PAGINATION.PAGE_SIZE,
      });
      const countRateNft = await this.prisma.rateNft.count({ where });
      const ratedArtWork = {
        data: rateNftData,
        metadata: {
          page: page || DEFAULT_PAGINATION.PAGE + 1,
          limit: limit || DEFAULT_PAGINATION.PAGE_SIZE,
          total: {
            pages: Math.ceil(countRateNft / (limit || DEFAULT_PAGINATION.PAGE_SIZE)),
            records: countRateNft,
          },
        },
      };
      return {
        comment,
        like,
        ratedArtWork,
      };
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }
}
