import { Resolver, Query, Mutation, Args, Int, ResolveField, Parent } from '@nestjs/graphql';
import { WalletService } from './wallet.service';
import { Wallet } from './entities/wallet.entity';
import { CreateWalletInput } from './dto/create-wallet.input';
import { UpdateWalletInput } from './dto/update-wallet.input';
import { UseGuards } from '@nestjs/common';
import { GqlAuthGuard } from 'src/shared/guards/gql-authguard';
import { MessageEntity } from 'src/common/message.entity';

@Resolver(() => Wallet)
export class WalletResolver {
  constructor(private readonly walletService: WalletService) {}

  @UseGuards(GqlAuthGuard)
  @Query(() => [Wallet], { name: 'wallet' })
  findAll() {
    return this.walletService.findAll();
  }

  @UseGuards(GqlAuthGuard)
  @Mutation(() => MessageEntity)
  removeWallet() {
    return this.walletService.remove();
  }

  @UseGuards(GqlAuthGuard)
  @Mutation(() => Wallet)
  async connectWallet(@Args('createWalletInput') createWalletInput: CreateWalletInput) {
    return this.walletService.create(createWalletInput);
  }

  @ResolveField()
  async user(@Parent() wallet: Wallet) {
    const { userId } = wallet;
    return this.walletService.populateUser(userId);
  }
}
