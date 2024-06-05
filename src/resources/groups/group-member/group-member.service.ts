import { BadRequestException, Injectable, InternalServerErrorException } from '@nestjs/common';
import { PrismaService } from 'src/shared/prisma/prisma.service';
import { SessionService } from 'src/shared/session/session.service';
import { CreateGroupMemberInput } from './dto/create-group-member.input';
import { AcceptRejectGroupInviteInput } from '../group-invite/dto/accept-group-invite.input';
import { GROUP_INVITE_ACCEPT_REJECT } from 'src/common/constants';

@Injectable()
export class GroupMemberService {
  constructor(private readonly session: SessionService, private readonly prisma: PrismaService) {}

  async createMember(createGroupMemberInput: CreateGroupMemberInput) {
    const profileId = this.session.getUserProfileId();
    const member = await this.prisma.groupMember.create({
      data: {
        ...createGroupMemberInput,
        profileId,
      },
    });
    console.log(member);
    return member;
  }

  async leave(groupId: string) {
    const profileId = this.session.getUserProfileId();
    const group = await this.prisma.groupMember.findFirst({
      where: {
        groupId,
        deleted: false,
        profileId,
      },
      include: {
        group: {
          select: {
            ownerProfileId: true,
          },
        },
      },
    });
    if (group) {
      if (group.group.ownerProfileId === profileId) {
        const firstMember = await this.prisma.groupMember.findFirst({
          where: {
            groupId,
            deleted: false,
          },
          orderBy: [{ createdAt: 'desc' }],
          select: {
            profileId: true,
          },
        });
        const newOwner = await this.prisma.group.update({
          where: {
            id: groupId,
          },
          data: {
            ownerProfileId: firstMember?.profileId,
          },
        });
      }

      const update = await this.prisma.groupMember.update({
        where: { id: group.id },
        data: {
          deleted: true,
        },
      });
      return { message: `Group left successfully` };
    }
  }

  // tempMember(){
  //  const profileId=this.session.getUserProfileId()
  // return this.prisma.groupMember.create({
  //   data: {
  //     profileId}
  // })

  async notification_inviteAccepted(refKey: string) {
    try {
      const inviteNotification = await this.prisma.groupInvite.findFirst({
        where: {
          id: refKey,
          deleted: false,
        },
      });
      return inviteNotification;
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }

  async groupInviteAcceptById(acceptRejectGroupInviteInput: AcceptRejectGroupInviteInput) {
    const { TYPE, groupInviteId } = acceptRejectGroupInviteInput;
    const profileId = this.session.getUserProfileId();
    const userEmail = this.session.getUserEmail();
    const userwalletAddress = this.session.getUserWalletAddress();
    const groupInviteDetails = await this.prisma.groupInvite.findFirst({
      where: {
        id: groupInviteId,
        deleted: false,
      },
      select: {
        walletAddress: true,
        email: true,
        profile: {
          select: {
            id: true,
          },
        },
        groupId: true,
      },
    });
    if (!groupInviteDetails) {
      throw new BadRequestException('Invite not found');
    }

    if (groupInviteDetails.email) {
      if (groupInviteDetails.email !== userEmail) {
        throw new BadRequestException('this invitation does not belongs to this user');
      }
    }

    if (groupInviteDetails.walletAddress) {
      if (groupInviteDetails.walletAddress !== userwalletAddress) {
        throw new BadRequestException('this invitation does not belongs to this user');
      }
    }

    const check = await this.prisma.groupMember.findFirst({
      where: {
        profileId,
        groupId: groupInviteDetails?.groupId,
        deleted: false,
      },
    });

    if (TYPE === GROUP_INVITE_ACCEPT_REJECT.REJECT) {
      await this.prisma.groupInvite.update({
        where: {
          id: groupInviteId,
        },
        data: {
          deleted: true,
        },
      });
      return {
        message: 'invite rejected successfully',
      };
    }

    if (check) {
      throw new BadRequestException('this user is already in the group');
    }

    const creteMember = await this.prisma.groupMember.create({
      data: {
        groupId: groupInviteDetails.groupId,
        profileId,
        role: 'Member',
      },
    });
    await this.prisma.groupInvite.update({
      where: {
        id: groupInviteId,
      },
      data: {
        deleted: true,
      },
    });
    return {
      message: 'You have successfully joined this group',
    };
  }
}
