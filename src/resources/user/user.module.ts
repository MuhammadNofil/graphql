import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserResolver } from './user.resolver';
import { PassportModule } from '@nestjs/passport';
import { SharedModule } from 'src/shared/shared.module';
import { jwtConfig } from 'src/config/jwt-token.config';
import { JwtModule } from '@nestjs/jwt';
import { ProfileModule } from './profile/profile.module';
import { WalletModule } from './wallet/wallet.module';
import { HttpModule, HttpService } from '@nestjs/axios';
import { Auth } from 'googleapis';
import { NotificationModule } from './notification/notification.module';

@Module({
  imports: [
    PassportModule.register({ defaultStrategy: 'jwt' }),
    SharedModule,
    JwtModule.register(jwtConfig),
    ProfileModule,
    WalletModule,
    HttpModule,
    NotificationModule,
  ],
  providers: [UserResolver, UserService, Auth.OAuth2Client],
  exports: [UserService],
})
export class UserModule {}
