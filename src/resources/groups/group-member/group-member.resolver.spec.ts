import { Test, TestingModule } from '@nestjs/testing';
import { GroupMemberResolver } from './group-member.resolver';
import { GroupMemberService } from './group-member.service';

describe('GroupMemberResolver', () => {
  let resolver: GroupMemberResolver;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [GroupMemberResolver, GroupMemberService],
    }).compile();

    resolver = module.get<GroupMemberResolver>(GroupMemberResolver);
  });

  it('should be defined', () => {
    expect(resolver).toBeDefined();
  });
});
