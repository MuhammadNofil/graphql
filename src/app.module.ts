import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { GraphQLModule } from '@nestjs/graphql';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { SharedModule } from './shared/shared.module';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { join } from 'path';
import { ScheduleModule } from '@nestjs/schedule';
import { ResourcesModule } from './resources/resources.module';
import { ApolloServerPluginLandingPageLocalDefault, Context } from 'apollo-server-core';

@Module({
  imports: [
    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      debug: false,
      playground: false,
      subscriptions: {
        // 'graphql-ws': {
        //   path: '/graphql',
        //   onConnect: (context: Context<any>) => {
        //     const { connectionParams, extra } = context;
        //     extra.user = { user: {} };
        //   },
        // },
        // 'subscriptions-transport-ws': {
        //   path: '/graphql',
        // },
        // 'graphql-ws': true,
        'subscriptions-transport-ws': {
          path: '/graphql',
        },
      },
      // installSubscriptionHandlers: true,
      autoSchemaFile: join(process.cwd(), 'src/schema.gql'),
      plugins: [ApolloServerPluginLandingPageLocalDefault()],
    }),
    ScheduleModule.forRoot(),
    ConfigModule.forRoot(),
    SharedModule,
    ResourcesModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
