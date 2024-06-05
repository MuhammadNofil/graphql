import { Module } from '@nestjs/common';
import { SharedModule } from 'src/shared/shared.module';
import { UserModule } from './user/user.module';
import { NftModule } from './nft/nft.module';
import { GroupsModule } from './groups/groups.module';

@Module({
  imports: [UserModule, SharedModule, NftModule, GroupsModule],
})
export class ResourcesModule {}
