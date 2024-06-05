import { BadRequestException, Injectable, InternalServerErrorException } from '@nestjs/common';
import { connect } from 'http2';
import { MessageEntity } from 'src/common/message.entity';
import { PrismaService } from 'src/shared/prisma/prisma.service';
import { SessionService } from 'src/shared/session/session.service';
import { CreateBlockProfileInput } from './dto/create-block-profile.input';
import { UnBlockProfileInput } from './dto/update-block-profile.input';

@Injectable()
export class BlockProfileService {
  constructor(private readonly session: SessionService, private readonly prisma: PrismaService) {}
  async block(createBlockProfileInput: CreateBlockProfileInput) {
    try {
      const { blockedProfileId } = createBlockProfileInput;
      const profileId = this.session.getUserProfileId();
      if (profileId == blockedProfileId) {
        throw new BadRequestException('You cannot block yourself');
      }
      const check = await this.prisma.block.findFirst({
        where: {
          profileId,
          blockedProfileId,
          deleted: false,
        },
      });
      if (check) {
        if (check.isBlocked === true) {
          throw new BadRequestException('Profile already blocked');
        }
        const block = await this.prisma.block.update({
          where: {
            id: check.id,
          },
          data: {
            isBlocked: true,
          },
        });
        return block;
      }
      console.log({ profileId, blockedProfileId });
      const block = await this.prisma.block.create({
        data: {
          profileId,
          blockedProfileId,
        },
      });
      return block;
    } catch (error) {
      console.log(error);
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

  async findAll() {
    try {
      const profileId = this.session.getUserProfileId();
      const blocked = await this.prisma.block.findMany({
        where: {
          profileId,
          isBlocked: true,
          deleted: false,
        },
      });
      return blocked;
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }

  async findOne(id: string) {
    try {
      const profileId = this.session.getUserProfileId();
      const blocked = await this.prisma.block.findFirst({
        where: {
          profileId,
          id,
          isBlocked: true,
          deleted: false,
        },
      });
      return blocked;
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }

  async unblock(unBlockProfileInput: UnBlockProfileInput): Promise<MessageEntity> {
    try {
      const { blockedProfileId } = unBlockProfileInput;
      const profileId = this.session.getUserProfileId();
      const check = await this.prisma.block.findFirst({
        where: {
          profileId,
          blockedProfileId,
          isBlocked: true,
          deleted: false,
        },
      });
      if (!check) {
        throw new BadRequestException('Profile not blocked');
      }
      const unblock = await this.prisma.block
        .update({
          where: {
            id: check.id,
          },
          data: {
            isBlocked: false,
          },
          select: {
            blockedProfile: {
              select: {
                user: {
                  select: {
                    userName: true,
                  },
                },
              },
            },
          },
        })
        .then((e) => e?.blockedProfile?.user?.userName);
      return { message: `User ${unblock} unblocked successfully` };
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }

  remove(id: number) {
    return `This action removes a #${id} blockProfile`;
  }
}
