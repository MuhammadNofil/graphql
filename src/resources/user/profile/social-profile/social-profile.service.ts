import { BadRequestException, Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/shared/prisma/prisma.service';
import { SessionService } from 'src/shared/session/session.service';
import { Profile } from '../entities/profile.entity';
import { ProfileService } from '../profile.service';
import { CreateSocialProfileInput } from './dto/create-social-profile.input';
import { UpdateSocialProfileInput } from './dto/update-social-profile.input';
import { SocialProfile } from './entities/social-profile.entity';

@Injectable()
export class SocialProfileService {
  constructor(
    private readonly session: SessionService,
    private readonly prisma: PrismaService, // private readonly profileService: ProfileService,
  ) {}

  async create(createSocialProfileInput: CreateSocialProfileInput): Promise<Partial<SocialProfile>> {
    try {
      const profileId: string = this.session.getUserProfileId();
      const check = await this.prisma.socialProfile.findFirst({
        where: {
          profileId,
          deleted: false,
          type: createSocialProfileInput.type,
        },
        select: {
          id: true,
        },
      });
      if (check) {
        throw new BadRequestException(`Social Profile for ${createSocialProfileInput.type} already exists`);
      }
      const socialProfile: Partial<SocialProfile> = await this.prisma.socialProfile.create({
        data: {
          ...createSocialProfileInput,
          profileId,
        },
      });
      return socialProfile;
    } catch (error) {
      console.log(error);
      throw new InternalServerErrorException(error);
    }
  }

  async findAll(id?: string): Promise<Partial<SocialProfile>[]> {
    try {
      const profileId: string = id || this.session.getUserProfileId();
      const socialProfiles = await this.prisma.socialProfile.findMany({
        where: {
          profileId,
          deleted: false,
        },
        orderBy: [
          {
            updatedAt: 'desc',
          },
        ],
      });
      return socialProfiles;
    } catch (error) {
      console.log(error);
      throw new InternalServerErrorException(error);
    }
  }

  async findOne(id: string) {
    try {
      const socialProfiles = await this.prisma.socialProfile.findFirst({
        where: {
          id,
          deleted: false,
        },
      });
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }

  async update(updateSocialProfileInput: UpdateSocialProfileInput) {
    try {
      const { id, ...rest } = updateSocialProfileInput;
      const profileId = this.session.getUserProfileId();
      const check = await this.prisma.socialProfile
        .findFirst({
          where: {
            profileId,
            id,
            deleted: false,
          },
          select: {
            id: true,
          },
        })
        .then((data) => data.id);
      if (!check) {
        throw new NotFoundException('SocialProfile not found');
      }
      const update = await this.prisma.socialProfile.update({
        where: {
          id: check,
        },
        data: rest,
      });
      return update;
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }

  async remove(id: string) {
    try {
      const profileId = this.session.getUserProfileId();
      const remove = await this.prisma.socialProfile.update({
        where: {
          id,
        },
        data: {
          deleted: true,
        },
      });
      const socialProfile = await this.findAll();
      return socialProfile;
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }

  async populateProfile(profileId: string): Promise<Partial<Profile>> {
    try {
      const profile = await this.prisma.profile.findFirst({
        where: {
          id: profileId,
          deleted: false,
        },
      });
      return profile;
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }
}
