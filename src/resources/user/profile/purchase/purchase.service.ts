import { BadRequestException, Injectable, InternalServerErrorException } from '@nestjs/common';
import { addDays } from 'date-fns';
import { PrismaService } from 'src/shared/prisma/prisma.service';
import { SessionService } from 'src/shared/session/session.service';
import { CreatePurchaseInput } from './dto/create-purchase.input';
import { UpdatePurchaseInput } from './dto/update-purchase.input';

@Injectable()
export class PurchaseService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly session: SessionService,

  ) {

  }
  // create(createPurchaseInput: CreatePurchaseInput) {
  //   return 'This action adds a new purchase';
  // }

  // findAll() {
  //   return `This action returns all purchase`;
  // }

  // findOne(id: number) {
  //   return `This action returns a #${id} purchase`;
  // }

  // update(id: number, updatePurchaseInput: UpdatePurchaseInput) {
  //   return `This action updates a #${id} purchase`;
  // }

  // remove(id: number) {
  //   return `This action removes a #${id} purchase`;
  // }

  async purchaseSwipes() {
    try {
      const profileId = this.session.getUserProfileId();
      console.log(profileId);
      const coins = await this.prisma.profile.findFirst({
        where: {
          id: profileId,
          deleted: false,
        },
        select: {
          coins: true,
        }
      }).then((e) => e?.coins)


      if (coins < 200) {
        throw new BadRequestException('You have insufficient balance to purchase swipes')
      }
      const updateSwipes = await this.prisma.profile.update({
        where: {
          id: profileId,
        },
        data: {
          coins: { decrement: 200 },
          swipe: { increment: 200 }
        },
        select: {
          swipe: true
        }

      })
      return {
        message: `you have successfully bought 200 swipes now your total swipes are ${updateSwipes.swipe}`
      }

    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }

  async PurchaseProfileFeature() {
    let dueDay: Date
    const profileId = this.session.getUserProfileId()
    const rewards = await this.prisma.profile.findFirst({
      where: {
        id: profileId,
        deleted: false,
      },
      select: {
        coins: true,
        featureDate: true
      }
    })
    const currentdate = new Date()
    if (rewards.featureDate < currentdate) {
      dueDay = addDays(currentdate, 7)
    } else {
      dueDay = addDays(rewards.featureDate, 7)
    }
    if (rewards.coins < 1000) {
      throw new BadRequestException('you have insufficient balance')
    }

    const buyFeature = await this.prisma.profile.update({
      where: {
        id: profileId,

      },
      data: {
        coins: { decrement: 1000 },
        featureDate: dueDay,
      }
    })

    return {
      message: 'your profile has successfully featured'
    }


  }


  async PurchaseNftFeature(nftId: string) {
    let dueDay: Date
    const profileId = this.session.getUserProfileId()
    const rewards = await this.prisma.nft.findFirst({
      where: {
        id: nftId,
        deleted: false,
        profileId
      },
      select: {
        featureDate: true,
        profile: {
          select: {
            coins: true,
          }
        }
      }
    })
    const currentdate = new Date()
    if (rewards.featureDate < currentdate) {
      dueDay = addDays(currentdate, 7)
    } else {
      dueDay = addDays(rewards.featureDate, 7)
    }
    if (rewards?.profile?.coins < 1000) {
      throw new BadRequestException('you have insufficient balance')
    }

    const buyFeature = await this.prisma.nft.update({
      where: {
        id: nftId,
      },
      data: {
        featureDate: dueDay,
        profile: {
          update: {
            coins: { decrement: 1000 }
          }
        }
      }
    })

    return {
      message: 'your nft has successfully featured'
    }
  }



}
