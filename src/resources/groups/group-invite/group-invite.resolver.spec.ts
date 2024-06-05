import { Test, TestingModule } from '@nestjs/testing';
import { GroupInviteResolver } from './group-invite.resolver';
import { GroupInviteService } from './group-invite.service';

describe('GroupInviteResolver', () => {
  let resolver: GroupInviteResolver;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [GroupInviteResolver, GroupInviteService],
    }).compile();

    resolver = module.get<GroupInviteResolver>(GroupInviteResolver);
  });

  it('should be defined', () => {
    expect(resolver).toBeDefined();
  });
});
