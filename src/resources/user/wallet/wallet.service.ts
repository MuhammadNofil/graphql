import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  MethodNotAllowedException,
} from '@nestjs/common';
import { PrismaService } from 'src/shared/prisma/prisma.service';
import { SessionService } from 'src/shared/session/session.service';
import { CreateWalletInput } from './dto/create-wallet.input';
import { UpdateWalletInput } from './dto/update-wallet.input';
import { Wallet, User } from '@prisma/client';

@Injectable()
export class WalletService {
  constructor(private readonly prisma: PrismaService, private readonly session: SessionService) {}

  async create(createWalletInput: CreateWalletInput): Promise<Wallet> {
    try {
      const userId: string = this.session.getUserId();
      const { address } = createWalletInput;

      const check: Partial<Wallet>[] = await this.prisma.wallet.findMany({
        where: {
          userId,
          deleted: false,
        },
      });
      //TODO: Check if the deleted implementation is ok

      if (!check) {
        throw new BadRequestException('Wallet already exists!');
      }

      const wallet = await this.prisma.wallet.create({
        data: {
          userId,
          address,
        },
        include: {
          user: true,
        },
      });
      return wallet;
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }

  async findAll() {
    try {
      const userId: string = this.session.getUserId();
      const wallets: Wallet[] = await this.prisma.wallet.findMany({
        where: {
          userId,
          deleted: false,
        },
      });
      return wallets;
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }

  // async findOne(id: string) {
  //   try {
  //     const wallet = await this.prisma.wallet.findUnique({
  //       where: {
  //         id,
  //       },
  //     });
  //     return wallet;
  //   } catch (error) {
  //     throw new InternalServerErrorException(error);
  //   }
  // }

  async populateWallet(id: string) {
    try {
      const wallet = await this.prisma.wallet.findMany({
        where: {
          userId: id,
          deleted: false,
        },
      });
      return wallet;
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }

  async findOne(id: string) {
    try {
      const wallet = await this.prisma.wallet.findUnique({
        where: {
          id,
        },
      });
      return wallet;
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }

  async update(id: number, updateWalletInput: UpdateWalletInput) {
    return `This action updates a #${id} wallet`;
  }

  async remove() {
    const userId: string = this.session.getUserId();
    const wallet = await this.prisma.wallet.findFirst({
      where: {
        userId,
        deleted: false,
      },
    });
    if (!wallet) {
      throw new BadRequestException('No wallet found');
    }
    try {
      const remove = await this.prisma.wallet.update({
        where: {
          id: wallet.id,
        },
        data: {
          deleted: true,
        },
      });
      return { message: `Wallet ${remove?.address} deleted successfully` };
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
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
}
