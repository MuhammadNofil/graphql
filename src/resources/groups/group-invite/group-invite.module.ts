import { Module } from '@nestjs/common';
import { GroupInviteService } from './group-invite.service';
import { GroupInviteResolver } from './group-invite.resolver';
import { SharedModule } from 'src/shared/shared.module';
import { GroupInviteController } from './group-invite.controller';
import { jwtConfig } from 'src/config/jwt-token.config';
import { JwtModule } from '@nestjs/jwt';

@Module({
  imports: [SharedModule, JwtModule.register(jwtConfig)],
  providers: [GroupInviteResolver, GroupInviteService],
  exports: [GroupInviteService],
  controllers: [GroupInviteController],
})
export class GroupInviteModule {}
