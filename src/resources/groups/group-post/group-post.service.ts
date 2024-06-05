import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { DEFAULT_PAGINATION } from 'src/common/constants';
import { PrismaService } from 'src/shared/prisma/prisma.service';
import { SessionService } from 'src/shared/session/session.service';
import { CreateGrouppostInput } from './dto/create-group-post.input';
import { FindManyGroupPostDto } from './dto/filter-many-group-post.input';
import { UpdateGrouppostInput } from './dto/update-group-post.input';

@Injectable()
export class GroupPostService {
  constructor(private readonly session: SessionService, private readonly prisma: PrismaService) {}
  logger = new Logger(GroupPostService.name);

  async create(createGrouppostInput: CreateGrouppostInput) {
    try {
      const { nftId, groupId, description } = createGrouppostInput;
      const profileId = this.session.getUserProfileId();
      const check = await this.prisma.groupPost.findFirst({
        where: {
          nftId,
          groupId,
          profileId,
        },
      });
      if (check) {
        throw new BadRequestException(`Cannot post the same NFT more than once in a group`);
      }
      const groupPost = await this.prisma.groupPost.create({
        data: { profileId, ...createGrouppostInput },
      });
      return groupPost;
    } catch (error) {
      this.logger.error(error);
      throw new InternalServerErrorException(error);
    }
  }

  // TODO:  FILTER IS NOT WOKRKING IN THIS API
  async findAllGroupPost(findManyGroupPostDto: FindManyGroupPostDto) {
    try {
      const { filter, pagination } = findManyGroupPostDto;
      console.log(filter, pagination);
      const profileId = this.session.getUserProfileId();
      const groupPostWhereArgs: Prisma.GroupPostFindManyArgs = {
        where: {
          profileId,
          deleted: false,
        },

        skip: (pagination?.page - 1) * pagination?.limit || DEFAULT_PAGINATION.PAGE,
        take: +pagination?.limit || DEFAULT_PAGINATION.PAGE_SIZE,
      };
      if (filter) {
        if (filter.description) {
          groupPostWhereArgs.where.description = filter.description;
        }
        if (filter.nftTitle) {
          groupPostWhereArgs.where.nft = {
            title: filter.nftTitle,
          };
        }
      }
      const data = await this.prisma.groupPost.findMany(groupPostWhereArgs);
      const count = await this.prisma.groupPost.count({ where: groupPostWhereArgs.where });
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

  findOneGroupPost(id: string) {
    return this.prisma.groupPost.findFirst({
      where: { deleted: false, id },
    });
  }

  async update(updateGrouppostInput: UpdateGrouppostInput) {
    try {
      const { id, description } = updateGrouppostInput;
      const profileId = this.session.getUserProfileId();
      const check = await this.prisma.groupPost
        .findFirst({
          where: { deleted: false, profileId, id },
          select: {
            id: true,
          },
        })
        .then((e) => e.id);
      if (!check) {
        throw new NotFoundException('Post not found');
      }
      const updatePost = this.prisma.groupPost.update({
        where: { id: check },
        data: { description },
      });
      console.log(updatePost);
      return updatePost;
    } catch (error) {}
  }

  async removeGroupPost(id: string) {
    try {
      const profileId = this.session.getUserProfileId();
      const check = await this.prisma.groupPost
        .findFirst({
          where: { id, deleted: false, profileId },

          select: {
            id: true,
          },
        })
        .then((e) => e?.id);
      if (!check) {
        throw new BadRequestException(`No group post found for ${id}`);
      }
      const removePost = await this.prisma.groupPost
        .update({
          where: { id: check },
          data: {
            deleted: true,
          },
          select: { deleted: true },
        })
        .then((e) => e?.deleted);
      return { message: `Post deleted successfully` };
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }

  async postCount(groupId: string): Promise<number> {
    try {
      const allCountPost = await this.prisma.groupPost.count({
        where: { deleted: false, groupId },
      });
      return allCountPost;
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
    console.log('🚀 ~ file: group-post.service.ts:170 ~ GroupPostService ~ populateNft ~ nftId', nftId);
    try {
      const Nft = await this.prisma.nft.findFirst({
        where: {
          deleted: false,
          id: nftId,
        },
      });
      console.log('🚀 ~ file: group-post.service.ts:178 ~ GroupPostService ~ populateNft ~ Nft', Nft);
      // if (!Nft) {
      //   throw new BadRequestException('Nft not found');
      // }
      return Nft;
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }

  async populateGroup(groupId: string) {
    try {
      const Group = await this.prisma.group.findFirst({
        where: {
          deleted: false,
          id: groupId,
        },
      });
      if (!Group) {
        throw new BadRequestException('Nft not found');
      }
      return Group;
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }
}
