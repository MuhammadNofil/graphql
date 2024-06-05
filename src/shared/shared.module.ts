import { Module } from '@nestjs/common';
import { JwtStrategy } from './guards/jwt.strategy';
import { PrismaService } from './prisma/prisma.service';
import { JwtModule, JwtService } from '@nestjs/jwt';
import { jwtConfig } from 'src/config/jwt-token.config';
import { SessionService } from './session/session.service';
import { CrypterService } from './crypter/crypter.service';
import { OtpService } from './otp/otp.service';
import { HelpersService } from './helpers/helpers.service';
import { HttpClientService } from './http-client/http-client.service';
import { HttpModule, HttpService } from '@nestjs/axios';
import { FileService } from './file/file.service';
import { EmailService } from './email/email.service';
import { EmailClientService } from './email-client/email-client.service';
import { PubSub } from 'graphql-subscriptions';
import { NotificationManagerService } from './notification-manager/notification-manager.service';
import { RealtimeModule } from './realtime/realtime.module';
import { RealtimeGateway } from './realtime/realtime.gateway';
import { RewardsService } from './rewards/rewards.service';
import { JsonHelperService } from './json-helper/json-helper.service';
import { CompressionHelperService } from './compression-helper/compression-helper.service';
import { SuperRareGqlService } from './super-rare-gql/super-rare-gql.service';
import { ERC_721_GqlService } from './ERC-721-gql/ERC-721-gql-service';
import { FoundationGqlService } from './foundation-gql/foundation-gql.service';
import { OPENSEA_v1GqlService } from './open-sea -v1-gql/open-sea-gql.service';
import { OPENSEA_v2GqlService } from './open-sea-v2-gql/open-sea-v2.service';
import { SchedulerService } from './scheduler/scheduler.service';
import { QueryHandlerService } from './query-handler/query-handler.service';

@Module({
  imports: [JwtModule.register(jwtConfig), HttpModule, RealtimeModule],
  providers: [
    PrismaService,
    JwtStrategy,
    SessionService,
    CrypterService,
    OtpService,
    HelpersService,
    HttpClientService,
    FileService,
    EmailService,
    EmailClientService,
    PubSub,
    NotificationManagerService,
    RewardsService,
    JsonHelperService,
    CompressionHelperService,
    SuperRareGqlService,
    ERC_721_GqlService,
    FoundationGqlService,
    OPENSEA_v1GqlService,
    OPENSEA_v2GqlService,
    SchedulerService,
    QueryHandlerService,
  ],
  exports: [
    PrismaService,
    JwtStrategy,
    SessionService,
    CrypterService,
    OtpService,
    HelpersService,
    HttpClientService,
    EmailService,
    FileService,
    EmailClientService,
    PubSub,
    NotificationManagerService,
    RewardsService,
    JsonHelperService,
    CompressionHelperService,
    SuperRareGqlService,
    ERC_721_GqlService,
    FoundationGqlService,
    OPENSEA_v1GqlService,
    OPENSEA_v2GqlService,
    QueryHandlerService,
  ],
})
export class SharedModule {}
