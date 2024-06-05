import { Inject, Injectable, InternalServerErrorException, forwardRef } from '@nestjs/common';
import { PubSub } from 'graphql-subscriptions';
import { CreateNotificationInput } from 'src/resources/user/notification/dto/create-notification.input';
import { PrismaService } from '../prisma/prisma.service';
import { SessionService } from '../session/session.service';
import { RealtimeGateway } from '../realtime/realtime.gateway';

@Injectable()
export class NotificationManagerService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly session: SessionService,
    private readonly pubSub: PubSub,
    private readonly realtime: RealtimeGateway,
  ) {}

  async create(createNotificationInput: CreateNotificationInput) {
    try {
      const createdBy = this.session.getUserId();
      if (!createNotificationInput.createdBy) {
        createNotificationInput.createdBy = createdBy;
      }
      console.log(this.pubSub);
      const notification = await this.prisma.notification.create({ data: createNotificationInput });
      const notinoti = this.realtime.notification(notification);
      const check = await this.pubSub.publish(`notification-${notification.userId}`, { notification: notification });
      return notification;
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }
}
