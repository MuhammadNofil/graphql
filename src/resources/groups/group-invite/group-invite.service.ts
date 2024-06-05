import { BadRequestException, Injectable, InternalServerErrorException, Logger } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Prisma, Profile, Role, User } from '@prisma/client';
import { ideahub } from 'googleapis/build/src/apis/ideahub';
import {
  BACKEND_URL,
  BASE_URL,
  notificationMessageBuilder,
  NOTIFICATION_TYPE,
  GROUP_INVITE_ACCEPT_REJECT,
} from 'src/common/constants';
import { CreateNotificationInput } from 'src/resources/user/notification/dto/create-notification.input';
import { EmailService } from 'src/shared/email/email.service';
import { NotificationManagerService } from 'src/shared/notification-manager/notification-manager.service';
import { PrismaService } from 'src/shared/prisma/prisma.service';
import { SessionService } from 'src/shared/session/session.service';
import { buffer } from 'stream/consumers';
import { CreateGroupInviteInput } from './dto/create-group-invite.input';
import { UpdateGroupInviteInput } from './dto/update-group-invite.input';
import { AcceptRejectGroupInviteInput } from './dto/accept-group-invite.input';

@Injectable()
export class GroupInviteService {
  constructor(
    private readonly session: SessionService,
    private readonly prisma: PrismaService,
    private readonly email: EmailService,
    private readonly jwt: JwtService,
    private readonly notificationManager: NotificationManagerService,
  ) {}

  logger = new Logger(GroupInviteService.name);

  async create(createGroupInviteInput: CreateGroupInviteInput) {
    const invitedByProfileId = this.session.getUserProfileId();
    const { email, walletAddress, groupId } = createGroupInviteInput;
    if (!email && !walletAddress) {
      throw new BadRequestException('Either provide a email address or wallet address');
    }
    if (walletAddress) {
      const check = await this.prisma.wallet
        .findFirst({
          where: {
            address: walletAddress,
            deleted: false,
          },
          select: {
            id: true,
          },
        })
        .then((e) => e.id);
      if (check) {
        const ownerId = this.prisma.group.findFirst({
          where: {
            id: groupId,
            ownerProfileId: invitedByProfileId,
          },
          select: {
            ownerProfileId: true,
          },
        });
        if (ownerId) {
          const checkIfExist = await this.prisma.groupMember.findFirst({
            where: {
              groupId,
              profile: {
                AND: {
                  user: {
                    email,
                    OR: {
                      wallet: {
                        some: {
                          address: walletAddress,
                        },
                      },
                    },
                  },
                },
              },
            },
          });
          if (!checkIfExist) {
            const invite = await this.prisma.groupInvite.create({
              data: {
                invitedByProfileId,
                email,
                walletAddress,
                groupId,
              },
            });
            return invite;
          }
        } else {
          return { message: `Group invitation failed` };
        }
      } else {
        return { message: `wallet address doesnt exists ` };
      }
    } else {
      const user = await this.prisma.user
        .findFirst({
          where: {
            email,
            deleted: false,
          },
          select: {
            id: true,
          },
        })
        .then((e) => e.id);
      if (user) {
        const ownerId = this.prisma.group.findFirst({
          where: {
            id: groupId,
            ownerProfileId: invitedByProfileId,
          },
          select: {
            ownerProfileId: true,
          },
        });
        if (ownerId) {
          const checkIfExist = await this.prisma.groupMember.findFirst({
            where: {
              groupId,
              profile: {
                AND: {
                  user: {
                    email,
                    OR: {
                      wallet: {
                        some: {
                          address: walletAddress,
                        },
                      },
                    },
                  },
                },
              },
            },
          });
          if (!checkIfExist) {
            const invite = await this.prisma.groupInvite.create({
              data: {
                invitedByProfileId,
                email,
                walletAddress,
                groupId,
              },
            });

            return invite;
          }
        }
      }
    }
  }

  async invite(createGroupInviteInput: CreateGroupInviteInput) {
    try {
      const userName = this.session.getUserName();
      const createruserId = this.session.getUserId();
      const { groupId, email, walletAddress } = createGroupInviteInput;
      const profileId = this.session.getUserProfileId();
      const userEmail = this.session.getUserEmail();
      const userwalletAddress = this.session.getUserWalletAddress();
      if (email === userEmail) {
        throw new BadRequestException('You cannot invite yourself');
      }
      if (walletAddress === userwalletAddress) {
        throw new BadRequestException('You cannot invite yourself');
      }
      const groupCheck = await this.prisma.group.findFirst({
        where: {
          id: groupId,
          deleted: false,
          ownerProfileId: profileId,
        },
        select: {
          id: true,
          name: true,
        },
      });
      if (!groupCheck) {
        throw new BadRequestException('This group does not belonds to you');
      }
      const existCehck = await this.prisma.groupMember.findFirst({
        where: {
          groupId: groupId,
          deleted: false,
          profile: {
            AND: {
              user: {
                email,
                OR: {
                  wallet: {
                    some: {
                      address: walletAddress,
                    },
                  },
                },
              },
            },
          },
        },
      });
      if (existCehck) {
        throw new BadRequestException(`user already exist in this group`);
      }
      //TODO: not needed for now
      // let userExist: User;
      // if (email) {
      //   userExist = await this.prisma.user.findFirst({
      //     where: {
      //       email,
      //       deleted: false,
      //     },
      //   });
      // } else if (walletAddress) {
      //   userExist = await this.prisma.user.findFirst({
      //     where: {
      //       wallet: {
      //         some: {
      //           address: walletAddress,
      //         },
      //       },
      //     },
      //   });
      // }
      // if (userExist) {
      const invite = await this.prisma.groupInvite.create({
        data: {
          groupId,
          invitedByProfileId: profileId,
          email,
          walletAddress,
        },
      });
      //TODO: emit notification
      // }
      const encode = Buffer.from(invite.id).toString('base64');
      const link = `${BACKEND_URL}/group-invite?signature=${encode}`;
      const inviter = this.session.getUserProfileName() || this.session.getUserName();
      const inviteEmail = await this.email.sendInvitationEmail({
        link,
        receiver: email,
        inviter,
        groupName: groupCheck.name,
      });

      let userId: string;

      if (email) {
        userId = await this.prisma.user
          .findFirst({
            where: {
              email,
              deleted: false,
            },
            select: {
              id: true,
            },
          })
          .then((user) => user?.id);
      } else if (walletAddress) {
        userId = await this.prisma.user
          .findFirst({
            where: {
              wallet: {
                some: {
                  address: walletAddress,
                  deleted: false,
                },
              },
              deleted: false,
            },
            select: {
              id: true,
            },
          })
          .then((user) => user?.id);
      }
      // const userId = await this.prisma.group
      //   .findFirst({
      //     where: {
      //       id: groupId,
      //       deleted: false,
      //     },
      //     select: {
      //       profile: {
      //         select: {
      //           userId: true,
      //         },
      //       },
      //     },
      //   })
      //   .then((e) => e?.profile?.userId);

      if (userId) {
        const groupName = await this.prisma.group
          .findFirst({
            where: {
              id: groupId,
              deleted: false,
            },
            select: {
              name: true,
            },
          })
          .then((e) => e?.name);
        const createNotificationInput: CreateNotificationInput = {
          userId,
          message: notificationMessageBuilder.invite(userName, userEmail),
          refKey: invite?.id,
          title: notificationMessageBuilder.invite(userName, groupName),
          type: NOTIFICATION_TYPE.GROUPINVITE,
          createdBy: createruserId,
        };
        await this.notificationManager.create(createNotificationInput);
      }
      return invite;
    } catch (error) {
      throw new BadRequestException(error);
    }
  }

  async handleInvite(signature: string) {
    try {
      const decode: string = Buffer.from(signature, 'base64').toString('ascii');
      const {
        id,
        email,
        walletAddress,
        groupId,
        profile: inviterProfile,
      } = await this.prisma.groupInvite.findFirst({
        where: {
          id: decode,
          deleted: false,
        },
        select: {
          id: true,
          email: true,
          walletAddress: true,
          groupId: true,
          profile: {
            select: {
              user: true,
            },
          },
        },
      });
      const {
        user: { userName, id: userId, email: userEmail },
      } = inviterProfile;

      let userExist: User & {
        profile: Profile;
        role: Role;
      };
      if (email) {
        userExist = await this.prisma.user.findFirst({
          where: {
            email,
            deleted: false,
          },
          include: {
            profile: true,
            role: true,
          },
        });
      } else if (walletAddress) {
        userExist = await this.prisma.user.findFirst({
          where: {
            wallet: {
              some: {
                address: walletAddress,
              },
            },
          },
          include: {
            profile: true,
            role: true,
          },
        });
      }
      if (userExist) {
        const token = this.jwt.sign({
          email: userExist.email,
          id: userExist.id,
          role: userExist.role.title,
        });
        const link = `${BASE_URL}/magic_signin?token=${token}`;
        const existCheckArgs: Prisma.GroupMemberFindFirstArgs = {
          where: {
            groupId: groupId,
            deleted: false,
          },
        };
        if (email) {
          existCheckArgs.where = {
            profile: {
              user: {
                email,
              },
            },
          };
        }
        if (walletAddress) {
          existCheckArgs.where = {
            profile: {
              user: {
                wallet: {
                  some: {
                    address: walletAddress,
                  },
                },
              },
            },
          };
        }
        const existCehck = await this.prisma.groupMember.findFirst(existCheckArgs);
        if (existCehck) {
          return link;
        }
        const member = await this.prisma.groupMember.create({
          data: {
            role: 'user',
            profileId: userExist.profile.id,
            groupId,
          },
          select: {
            id: true,
            profile: {
              select: {
                user: {
                  select: { id: true },
                },
              },
            },
          },
        });
        // const userId = await this.prisma.group
        //   .findFirst({
        //     where: {
        //       id: groupId,
        //       deleted: false,
        //     },
        //     select: {
        //       profile: {
        //         select: {
        //           userId: true,
        //         },
        //       },
        //     },
        //   })
        //   .then((e) => e?.profile?.userId);

        const groupName = await this.prisma.group
          .findFirst({
            where: {
              id: groupId,
              deleted: false,
            },
            select: {
              name: true,
            },
          })
          .then((e) => e?.name);
        const createNotificationInput: CreateNotificationInput = {
          userId,
          message: notificationMessageBuilder.inviteAccepted(userName, userEmail),
          refKey: member.id,
          title: notificationMessageBuilder.inviteAccepted(userName, groupName),
          type: NOTIFICATION_TYPE.INVITEACCEPTED,
          createdBy: member?.profile?.user?.id,
        };
        await this.notificationManager.create(createNotificationInput);

        return link;
      }
      const link = `${BASE_URL}/magic_signup?signature=${signature}&email=${email}`;

      return link;
    } catch (error) {
      console.log(error);
      this.logger.error(error);
      throw new InternalServerErrorException(error);
    }
  }

  async notification_Invite(refKey: string) {
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

  async sendGroupInvite(createGroupInviteInput: CreateGroupInviteInput) {
    const { groupId, walletAddress, email } = createGroupInviteInput;
    const senderEmail = this.session.getUserEmail();
    const senderWalletAddress = this.session.getUserWalletAddress();
    const profileId = this.session.getUserProfileId();

    if (senderEmail === email) {
      throw new Error('You can not send invite to yourself');
    }
    if (senderWalletAddress === walletAddress) {
      throw new Error('You can not send invite to yourself');
    }

    const check = await this.prisma.group.findFirst({
      where: {
        id: groupId,
        ownerProfileId: profileId,
      },
      select: {
        name: true,
      },
    });

    if (!check) {
      throw new Error('You are no the owner of this group');
    }

    const existGroupMemberCheck = await this.prisma.groupMember.findFirst({
      where: {
        groupId,
        role: 'member',
        profile: {
          user: {
            email,
            OR: {
              wallet: {
                some: {
                  address: walletAddress,
                },
              },
            },
          },
        },
      },
    });

    if (existGroupMemberCheck) {
      throw new Error('This user is already in the group');
    }

    const invite = await this.prisma.groupInvite.create({
      data: {
        groupId,
        walletAddress,
        email,
        invitedByProfileId: profileId,
      },
    });

    const encode = Buffer.from(invite.groupId).toString('base64');
    const link = `${BACKEND_URL}/group-invite?signature=${encode}`;
    const inviter = this.session.getUserProfileName() || this.session.getUserName();
    const inviteEmail = await this.email.sendInvitationEmail({
      link,
      receiver: email,
      inviter,
      groupName: check.name,
    });
    return invite;
  }

  async InviteGroupWhenSignedIn(signature: string) {
    try {
      const profileId = this.session.getUserProfileId();
      const decode: string = Buffer.from(signature, 'base64').toString('ascii');
      const existUser = await this.prisma.groupMember.findFirst({
        where: {
          group: {
            id: decode,
          },
          profileId,
          deleted: false,
        },
      });
      if (existUser) {
        console.log('user already exists');
        return;
      }
      const groupMember = await this.prisma.groupMember.create({
        data: {
          groupId: decode,
          profileId,
        },
      });
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }

  async shareGroup(groupId: string) {
    try {
      const check = await this.prisma.group.findFirst({
        where: {
          id: groupId,
          deleted: false,
        },
      });

      if (check) {
        const encode = Buffer.from(groupId).toString('base64');
        const link = `${BACKEND_URL}/share_group?signature=${encode}`;

        return link;
      }
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }

  async groupInviteviaId(acceptRejectGroupInviteInput: AcceptRejectGroupInviteInput) {
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
      throw new BadRequestException('Group invite not found');
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
      const reject = await this.prisma.groupInvite.update({
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
    return { message: 'invite accepted successfully' };
  }
}
