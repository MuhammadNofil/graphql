import { Injectable, InternalServerErrorException, Logger } from '@nestjs/common';
import { Group, Prisma, Profile } from '@prisma/client';
import { DEFAULT_PAGINATION } from 'src/common/constants';
import { FileService } from 'src/shared/file/file.service';
import { PrismaService } from 'src/shared/prisma/prisma.service';
import { SessionService } from 'src/shared/session/session.service';
import { CreateGroupInput } from './dto/create-group.input';
import { FindAllGrouptDto } from './dto/Find-all-gourp.input';
import { FindManyGrouptDto } from './dto/find-many-group.dto';
import { UpdateGroupInput } from './dto/update-group.input';
import { GroupPostService } from './group-post/group-post.service';

@Injectable()
export class GroupsService {
  constructor(
    private readonly session: SessionService,
    private readonly prisma: PrismaService,
    private readonly file: FileService,
    private readonly groupPostService: GroupPostService,
  ) {}

  logger = new Logger(GroupsService.name);

  async create(createGroupInput: CreateGroupInput) {
    try {
      const userId = this.session.getUserId();
      const ownerProfileId = this.session.getUserProfileId();
      const { banner: bnr, displayImage: di, ...rest } = createGroupInput;
      let banner: string, displayImage: string;
      if (di) {
        displayImage = (await this.file.uploadFileGenericBase64(di, userId, 'group-display-image')).url;
      }
      if (bnr) {
        banner = (await this.file.uploadFileGenericBase64(bnr, userId, 'banner-image')).url;
      }
      //TODO: display image should be uploaded if coming
      //TODO: banner too being uploaded if coming
      const group = await this.prisma.group.create({
        data: {
          ownerProfileId,

          banner,
          displayImage,
          ...rest,
        },
      });
      await this.prisma.groupMember.create({
        data: {
          role: 'admin',
          profileId: ownerProfileId,
          groupId: group.id,
        },
      });
      this.logger.debug(group);
      return group;
    } catch (error) {
      this.logger.error(error);
      throw new InternalServerErrorException(error);
    }
  }

  async findOneGroup(id: string) {
    try {
      return await this.prisma.group.findFirst({
        where: { id, deleted: false },
      });
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }

  async findMyGroups(findManyGroupDto: FindManyGrouptDto) {
    try {
      const { filter, pagination } = findManyGroupDto;
      const ownerProfileId = this.session.getUserProfileId();
      const groupWhereArg: Prisma.GroupFindManyArgs = {
        where: {
          deleted: false,
          ownerProfileId,
        },
        skip: (pagination?.page - 1) * pagination?.limit || DEFAULT_PAGINATION.PAGE,
        take: +pagination?.limit || DEFAULT_PAGINATION.PAGE_SIZE,
      };
      if (filter) {
        if (filter.name) {
          groupWhereArg.where.name = filter.name;
        }
      }
      const data = await this.prisma.group.findMany(groupWhereArg);
      const count = await this.prisma.group.count({ where: groupWhereArg.where });
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

  async FindAllGroup(findAllGrouptDto: FindAllGrouptDto) {
    try {
      const { filter, pagination } = findAllGrouptDto;
      const profileId = this.session.getUserProfileId();
      const groupWhereArg: Prisma.GroupFindManyArgs = {
        where: {
          deleted: false,
          groupMember: {
            some: {
              profileId,
              deleted: false,
            },
          },
        },
        skip: (pagination?.page - 1) * pagination?.limit || DEFAULT_PAGINATION.PAGE,
        take: +pagination?.limit || DEFAULT_PAGINATION.PAGE_SIZE,
      };
      if (filter) {
        if (filter.name) {
          groupWhereArg.where.name = filter.name;
        }
      }
      const data = await this.prisma.group.findMany(groupWhereArg);
      const count = await this.prisma.group.count({ where: groupWhereArg.where });
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

  async update(updateGroupInput: UpdateGroupInput) {
    try {
      const userId = this.session.getUserId();
      const profileId: string = this.session.getUserProfileId(); //TODO: get profile ID from session
      const { id, displayImage: dp, banner: bnr, ...rest } = updateGroupInput;
      const group: Group['id'] = await this.prisma.group
        .findFirst({
          where: {
            id,
            profile: {
              id: profileId,
            },
            deleted: false,
          },
          select: {
            id: true,
          },
        })
        .then((data) => data.id);
      if (!group) {
        throw new InternalServerErrorException('Group not found'); //TODO: what is this?
      }
      let displayImage: string, banner: string;
      if (dp) {
        displayImage = (await this.file.uploadFileGenericBase64(dp, userId, 'display-picture')).url;
        //TODO: itna copy mardia?
      }
      if (bnr) {
        banner = (await this.file.uploadFileGenericBase64(bnr, userId, 'banner-image')).url;
      }
      const update = await this.prisma.group.update({
        where: {
          id: group,
        },
        data: {
          ...rest,
          displayImage,
          banner,
        },
      });
      return update;
    } catch (error) {
      console.log(error);
      throw new InternalServerErrorException(error);
    }
  }

  async populateGroupPost(id: string) {
    try {
      const groupPosts = await this.prisma.groupPost.findMany({
        where: {
          groupId: id,
          deleted: false,
        },
      });
      return groupPosts;
    } catch (error) {}
  }

  async postCount(id: string) {
    return await this.groupPostService.postCount(id);
  }

  async populteOwnerProfile(ownerProfileId: string) {
    try {
      const check = await this.prisma.profile.findFirst({
        where: {
          id: ownerProfileId,
          deleted: false,
        },
      });
      return check;
    } catch (error) {}
  }

  async notification_Group(refKey: string) {
    try {
      const groupNotification = await this.prisma.group
        .findFirst({
          where: {
            id: refKey,
            deleted: false,
          },
          select: {
            id: true,
          },
        })
        .then((e) => e?.id);
      return groupNotification;
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }

  countGroupMembers(groupId: string) {
    try {
      const memberCount = this.prisma.groupMember.count({
        where: {
          groupId,
          deleted: false,
        },
      });
      return memberCount;
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }
}
