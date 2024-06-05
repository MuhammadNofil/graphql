import { BadRequestException, Injectable, InternalServerErrorException } from '@nestjs/common';
import { Prisma, Profile, RATING, SocialProfile, User } from '@prisma/client';
import { profile } from 'console';
import { addDays } from 'date-fns';
import { id } from 'date-fns/locale';
import { distinct } from 'rxjs';
import { BADGES, DEFAULT_PAGINATION } from 'src/common/constants';
import { PaginationDto } from 'src/common/pagination.dto';
import { FileService } from 'src/shared/file/file.service';
import { PrismaService } from 'src/shared/prisma/prisma.service';
import { SessionService } from 'src/shared/session/session.service';
import { CreateProfileInput } from './dto/create-profile.input';
import { UpdateProfileInput } from './dto/update-profile.input';
import { SocialProfileService } from './social-profile/social-profile.service';

@Injectable()
export class ProfileService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly session: SessionService,
    private readonly file: FileService,
    private readonly socialProfileService: SocialProfileService,
  ) {}

  async bootstrap(userId: User['id']) {
    try {
      const profile: Partial<Profile> = await this.prisma.profile.create({
        data: {
          userId,
        },
        select: {
          id: true,
        },
      });
      return profile.id;
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }

  findAll() {
    return `This action returns all profile`;
  }

  async populateUser(userId: string) {
    try {
      const user = await this.prisma.user.findUnique({
        where: {
          id: userId,
        },
      });
      return user;
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }

  async findOne(id: string) {
    try {
      const profile: Profile = await this.prisma.profile.findFirst({
        where: {
          user: {
            id,
          },
        },
      });
      return profile;
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }

  async myProfile() {
    try {
      const id = this.session.getUserProfileId();
      const profile: Profile = await this.prisma.profile.findFirst({
        where: {
          id,
          deleted: false,
        },
      });
      return profile;
    } catch (error) {
      console.log(error);
      throw new InternalServerErrorException(error);
    }
  }

  async update(updateProfileInput: UpdateProfileInput) {
    try {
      console.log(updateProfileInput);
      const userId: string = this.session.getUserId(); //TODO: get profile ID from session
      const { profilePicture: pp, banner: bnr, ...rest } = updateProfileInput;
      console.log('🚀 ~ file: profile.service.ts:88 ~ ProfileService ~ update ~ bnr', bnr);
      const profile: Profile['id'] = await this.prisma.profile
        .findFirst({
          where: {
            user: {
              id: userId,
            },
            deleted: false,
          },
          select: {
            id: true,
          },
        })
        .then((data) => data.id);
      if (!profile) {
        throw new InternalServerErrorException('Profile not found');
      }
      let profilePicture: any;
      if (pp) {
        profilePicture = await (await this.file.uploadFileGenericBase64(pp, userId, 'profile-picture')).url;
      }
      let banner: any;
      if (bnr) {
        banner = await (await this.file.uploadFileGenericBase64(bnr, userId, 'profile-picture')).url;
      }
      console.log(profilePicture);
      const update = await this.prisma.profile.update({
        where: {
          id: profile,
        },
        data: {
          ...rest,
          profilePicture,
          banner,
        },
      });
      return update;
    } catch (error) {
      console.log(error);
      throw new InternalServerErrorException(error);
    }
  }

  async getAllInterests() {
    try {
      const interests = await this.prisma.interests.findMany({
        where: {
          deleted: false,
        },
      });
      console.log(
        '🚀 x~ file: profile.service.ts ~ line 137 ~ ProfileService ~ getAllInterests ~ interests',
        interests,
      );
      return interests;
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }

  async populateNftImpression(id: string) {
    try {
      const nftImpression = await this.prisma.nftImpression.findMany({
        where: {
          profileId: id,
          deleted: false,
        },
      });
      return nftImpression;
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }

  async populateNftView(id: string) {
    try {
      const nftView = await this.prisma.nftImpression.findMany({
        where: {
          profileId: id,
          deleted: false,
        },
      });
      return nftView;
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }

  async populateGroupPost(id: string) {
    try {
      const groupPost = await this.prisma.groupPost.findMany({
        where: {
          profileId: id,
          deleted: false,
        },
      });
      return groupPost;
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }

  async populateGroups(id: string) {
    try {
      const groupPost = await this.prisma.group.findMany({
        where: {
          ownerProfileId: id,
          deleted: false,
        },
      });
      return groupPost;
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }

  async populateComments(id: string) {
    try {
      const comments = await this.prisma.comment.findMany({
        where: {
          profileId: id,
          deleted: false,
        },
      });
      return comments;
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }

  async populateRateNft(profileId: string) {
    try {
      const rateNft = await this.prisma.rateNft.findMany({
        where: {
          profileId,
          deleted: false,
        },
      });
      return rateNft;
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }

  async notification_Profile(refKey: string) {
    const profileNotification = await this.prisma.profile.findFirst({
      where: {
        id: refKey,
        deleted: false,
      },
    });
    return profileNotification;
  }

  remove(id: number) {
    return `This action removes a #${id} profile`;
  }

  async likesCount(profileId: string) {
    //TODO: fix naming when returning count use count in name also use this count in entity
    try {
      const count = await this.prisma.like.count({
        where: { profileId, liked: true, deleted: false },
      });
      return count;
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }

  async followedCount(profileId: string) {
    try {
      const count = await this.prisma.follow.count({
        where: {
          followerProfileId: profileId,
          isFollowed: true,
          deleted: false,
        },
      });
      return count;
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }

  async followersCount(profileId: string) {
    try {
      const count = await this.prisma.follow.count({
        where: {
          followedProfileId: profileId,
          isFollowed: true,
          deleted: false,
        },
      });
      return count;
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }

  async isFollowedFlag(profileId: string) {
    try {
      const check = await this.prisma.follow.findFirst({
        where: {
          followedProfileId: profileId,
          isFollowed: true,
          deleted: false,
        },
      });
      if (check) {
        return true;
      } else {
        return false;
      }
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }

  populateBadge(points: number) {
    switch (true) {
      case points < 500:
        return BADGES.NO_BADGE;
      case points >= 500 && points < 1500:
        return BADGES.BEGGINER;
      case points >= 1500 && points < 3000:
        return BADGES.SEMI_PRO;
      case points >= 3000 && points < 5000:
        return BADGES.MASTER;
      case points >= 5000 && points < 10000:
        return BADGES.SUPER_USER;
      case points >= 10000:
        return BADGES.KING;
      default:
        return BADGES.NO_BADGE;
    }
  }

  async markedVerifed(profileId: string) {
    try {
      const check = await this.prisma.profile.findFirst({
        where: {
          id: profileId,
          deleted: false,
        },
      });
      if (check) {
        const data = await this.prisma.profile.update({
          where: {
            id: profileId,
          },
          data: {
            verified: true,
          },
        });
        return {
          message: 'verified successfully',
        };
      }
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }

  async featuredProfile(pagination: PaginationDto) {
    try {
      const currentDate = new Date();
      const featuredProfile = await this.prisma.profile.findMany({
        where: {
          deleted: false,
          featureDate: {
            gte: currentDate,
          },
        },
        skip: (pagination?.page - 1) * pagination?.limit || DEFAULT_PAGINATION.PAGE,
        take: +pagination?.limit || DEFAULT_PAGINATION.PAGE_SIZE,
      });
      const count = await this.prisma.profile.count({
        where: {
          deleted: false,
          featureDate: {
            gte: currentDate,
          },
        },
      });

      return {
        data: featuredProfile,
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
      throw new InternalServerErrorException();
    }
  }

  async populateNft(profileId: string) {
    try {
      const nft = await this.prisma.nft.findMany({
        where: {
          profileId,
          deleted: false,
        },
      });
      return nft;
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }

  async topRatedProfiles(pagination: PaginationDto) {
    try {
      const profileId = this.session.getUserProfileId();
      const where: Prisma.NftWhereInput = {
        deleted: false,
        rateNft: {
          some: {
            rating: RATING.LIKE,
          },
        },
      };
      const data = await this.prisma.nft
        .findMany({
          distinct: ['profileId'],
          orderBy: {
            rateNft: {
              _count: 'desc',
            },
          },
          where,
          select: {
            profile: true,
          },
          skip: (pagination?.page - 1) * pagination?.limit || DEFAULT_PAGINATION.PAGE,
          take: +pagination?.limit || DEFAULT_PAGINATION.PAGE_SIZE,
        })
        .then((e) => e.map((x) => x?.profile));
      const count = await this.prisma.nft
        .groupBy({
          by: ['profileId'],
          where,
        })
        .then((e) => e?.length);
      console.log(count);
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

  async mostPopularProfiles() {
    const profiles = await this.prisma.profile.findMany({
      where: {
        deleted: false,
        rateNft: {
          some: {
            rating: {
              equals: RATING.LIKE,
            },
          },
        },
      },
    });
    return profiles;
  }
}
