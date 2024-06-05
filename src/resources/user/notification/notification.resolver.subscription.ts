import { Resolver, Query, Mutation, Args, Int, Subscription, ResolveField, Parent } from '@nestjs/graphql';
import { NotificationService } from './notification.service';
import { Notification, PaginatedNotification } from './entities/notification.entity';
import { CreateNotificationInput } from './dto/create-notification.input';
import { UpdateNotificationInput } from './dto/update-notification.input';
import { MessageEntity } from 'src/common/message.entity';
import { FindManyNotificationDto } from './dto/find-many-notification.dto';
import { PubSub } from 'graphql-subscriptions';
import { PrismaService } from 'src/shared/prisma/prisma.service';
import { Inject } from '@nestjs/common';

@Resolver(() => Notification)
export class NotificationResolverSubscription {
  constructor(
    @Inject('PUB_SUB')
    private readonly pubSub: PubSub,
    private readonly prisma: PrismaService,
  ) { }

  @Subscription((returns) => Notification)
  notification(@Args('userId', { type: () => String }) userId: string) {
    console.log({ userId });
    const data = this.pubSub.asyncIterator(`notification-${userId}`);
    // const data = this.pubSub.subscribe(`notification-${userId}`, [{userId}]);
    console.log(
      '🚀 ~ file: notification.resolver.subscription.ts:20 ~ NotificationResolverSubscription ~ notification ~ data',
      data,
    );
    return data;
  }

  @ResolveField()
  async user(@Parent() notification: Notification) {
    const { userId } = notification;
    return await this.prisma.user.findFirst({
      where: { id: userId, deleted: false },
    });
  }

  @ResolveField()
  async createdByUser(@Parent() notification: Notification) {
    const { createdBy } = notification;
    return this.prisma.user.findFirst({ where: { id: createdBy, deleted: false } });
  }
}
