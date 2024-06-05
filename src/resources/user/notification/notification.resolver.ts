import { Resolver, Query, Mutation, Args, Int, Subscription, ResolveField, Parent } from '@nestjs/graphql';
import { NotificationService } from './notification.service';
import { Notification, PaginatedNotification } from './entities/notification.entity';
import { CreateNotificationInput } from './dto/create-notification.input';
import { UpdateNotificationInput } from './dto/update-notification.input';
import { MessageEntity } from 'src/common/message.entity';
import { FindManyNotificationDto } from './dto/find-many-notification.dto';
import { PubSub } from 'graphql-subscriptions';
import { UseGuards } from '@nestjs/common';
import { GqlAuthGuard } from 'src/shared/guards/gql-authguard';

@Resolver(() => Notification)
export class NotificationResolver {
  constructor(private readonly notificationService: NotificationService, private readonly pubSub: PubSub) {}

  // @Mutation(() => Notification)
  // createNotification(@Args('createNotificationInput') createNotificationInput: CreateNotificationInput) {
  //   return this.notificationService.create(createNotificationInput);
  // }

  @UseGuards(GqlAuthGuard)
  @Query(() => PaginatedNotification)
  userNotifications_findAll(@Args('findManyNotificationDto') findManyNotificationDto: FindManyNotificationDto) {
    return this.notificationService.findAll(findManyNotificationDto);
  }

  // @Query(() => Notification, { name: 'notification' })
  // findOne(@Args('id', { type: () => Int }) id: number) {
  //   return this.notificationService.findOne(id);
  // }

  @UseGuards(GqlAuthGuard)
  @Mutation(() => Notification)
  updateNotification(@Args('updateNotificationInput') updateNotificationInput: UpdateNotificationInput) {
    return this.notificationService.updateRead(updateNotificationInput);
  }

  @UseGuards(GqlAuthGuard)
  @Mutation(() => MessageEntity)
  removeNotification(@Args('id', { type: () => String }) id: string) {
    return this.notificationService.remove(id);
  }

  @ResolveField()
  async user(@Parent() notification: Notification) {
    const { userId } = notification;
    return this.notificationService.populateUser(userId);
  }

  @ResolveField()
  async createdByUser(@Parent() notification: Notification) {
    const { createdBy } = notification;
    return this.notificationService.populateCreatedByUser(createdBy);
  }

  @ResolveField()
  async icon(@Parent() notification: Notification) {
    const { type, refKey } = notification;
    return this.notificationService.populateIcon(type, refKey);
  }
  // @Subscription((returns) => String)
  // test() {
  //   return 'hello world';
  // }
}
