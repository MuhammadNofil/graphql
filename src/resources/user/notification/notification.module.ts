import { Module } from '@nestjs/common';
import { NotificationService } from './notification.service';
import { NotificationResolver } from './notification.resolver';
import { SharedModule } from 'src/shared/shared.module';
import { PubSub } from 'graphql-subscriptions';
import { NotificationResolverSubscription } from './notification.resolver.subscription';

@Module({
  imports: [SharedModule],
  providers: [
    NotificationResolver,
    NotificationResolverSubscription,
    NotificationService,
    PubSub,
    {
      provide: 'PUB_SUB',
      useValue: new PubSub(),
    },
  ],
  exports: [NotificationService],
})
export class NotificationModule {}
