import { Resolver, Query, Mutation, Args, Int } from '@nestjs/graphql';
import { PurchaseService } from './purchase.service';
import { Purchase } from './entities/purchase.entity';
import { CreatePurchaseInput } from './dto/create-purchase.input';
import { UpdatePurchaseInput } from './dto/update-purchase.input';
import { MessageEntity } from 'src/common/message.entity';
import { UseGuards } from '@nestjs/common';
import { GqlAuthGuard } from 'src/shared/guards/gql-authguard';

@Resolver(() => Purchase)
export class PurchaseResolver {
  constructor(private readonly purchaseService: PurchaseService) { }

  // @Mutation(() => Purchase)
  // createPurchase(@Args('createPurchaseInput') createPurchaseInput: CreatePurchaseInput) {
  //   return this.purchaseService.create(createPurchaseInput);
  // }

  // @Query(() => [Purchase], { name: 'purchase' })
  // findAll() {
  //   return this.purchaseService.findAll();
  // }

  // @Query(() => Purchase, { name: 'purchase' })
  // findOne(@Args('id', { type: () => Int }) id: number) {
  //   return this.purchaseService.findOne(id);
  // }

  // @Mutation(() => Purchase)
  // updatePurchase(@Args('updatePurchaseInput') updatePurchaseInput: UpdatePurchaseInput) {
  //   return this.purchaseService.update(updatePurchaseInput.id, updatePurchaseInput);
  // }

  // @Mutation(() => Purchase)
  // removePurchase(@Args('id', { type: () => Int }) id: number) {
  //   return this.purchaseService.remove(id);
  // }
  @UseGuards(GqlAuthGuard)
  @Mutation(() => MessageEntity)
  purchase_swipes() {
    return this.purchaseService.purchaseSwipes();
  }


  @UseGuards(GqlAuthGuard)
  @Mutation(() => MessageEntity)
  PurchaseProfileFeature() {
    return this.purchaseService.PurchaseProfileFeature();
  }

  @UseGuards(GqlAuthGuard)
  @Mutation(() => MessageEntity)
  PurchaseNftFeature(@Args('nftId') nftId: string) {
    return this.purchaseService.PurchaseNftFeature(nftId)
  }



}
