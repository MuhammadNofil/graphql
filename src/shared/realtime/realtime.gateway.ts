import {
  WebSocketGateway,
  SubscribeMessage,
  MessageBody,
  OnGatewayDisconnect,
  OnGatewayConnection,
  OnGatewayInit,
  WebSocketServer,
} from '@nestjs/websockets';
import { RealtimeService } from './realtime.service';
import { CreateRealtimeDto } from './dto/create-realtime.dto';
import { Server, Socket } from 'socket.io';
import { UpdateRealtimeDto } from './dto/update-realtime.dto';
import { InternalServerErrorException, Logger } from '@nestjs/common';
import { verify, JwtPayload } from 'jsonwebtoken';
import { CreateNotificationInput } from 'src/resources/user/notification/dto/create-notification.input';
import { Notification } from '@prisma/client';

@WebSocketGateway({ namespace: 'gateway' })
export class RealtimeGateway implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect {
  constructor(private readonly realtimeService: RealtimeService) {}

  @WebSocketServer()
  server: Server;

  logger = new Logger(RealtimeGateway.name);

  @SubscribeMessage('createRealtime')
  create(@MessageBody() createRealtimeDto: CreateRealtimeDto) {
    return this.realtimeService.create(createRealtimeDto);
  }

  @SubscribeMessage('findAllRealtime')
  findAll() {
    this.realtimeService.findAll();
  }

  @SubscribeMessage('findOneRealtime')
  findOne(@MessageBody() obj: object) {
    // return this.realtimeService.findOne(id);
    console.log(obj);
    return this.test();
  }

  async test() {
    this.server.emit(`notificaiton`, 'test notification');
  }

  notification(createNotificationInput: Notification) {
    try {
      this.logger.debug(`emitting notification-${createNotificationInput.userId}: total-online`);
      const notinoti2 = this.server.emit(`notification-${createNotificationInput.userId}`, createNotificationInput);
      return notinoti2;
    } catch (error) {
      this.logger.error(error);
      throw new InternalServerErrorException(error);
    }
  }

  public async afterInit(client: Socket) {
    this.logger.debug(`socket initialized}`);
  }

  public async handleConnection(client: Socket) {
    this.logger.debug(`socket connected: ${client.id}`);
    let data: any;
    let id: string;
    let token: any = client.handshake.query.token;
    try {
      if (token) {
        token = token.replace('Bearer ', '');
        data = verify(token, process.env.JWT_SECRET || 'devSecret');
        id = data.id;
        client['user'] = data;
        this.logger.debug(`Client verified with socketID: ${client.id}, userID: ${data.id}, email ${data.email}`);
      } else {
        client.disconnect();
        this.logger.warn(`Client verification failed disconnected with socketID: ${client.id}`);
      }
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }

  public async handleDisconnect(client: Socket) {
    this.logger.debug(`Client disconnected with SocketID: ${client.id}`);
    let data: any;
    let id: string;
    let token: any = client.handshake.query.token;
    try {
      if (token) {
        token = token.replace('Bearer ', '');
        data = verify(token, process.env.JWT_SECRET || 'topSecret');
        id = data.id;
        client['user'] = data;
        this.logger.debug(
          `Disconnected Client verified with socketID: ${client.id}, userID: ${data.id}, email ${data.email}`,
        );
      } else {
        client.disconnect();
        this.logger.warn(`Disconnected Client verification failed disconnected with socketID: ${client.id}`);
      }
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }

  @SubscribeMessage('updateRealtime')
  update(@MessageBody() updateRealtimeDto: UpdateRealtimeDto) {
    return this.realtimeService.update(updateRealtimeDto.id, updateRealtimeDto);
  }

  @SubscribeMessage('removeRealtime')
  remove(@MessageBody() id: number) {
    return this.realtimeService.remove(id);
  }
}
