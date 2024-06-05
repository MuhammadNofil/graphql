import { Test, TestingModule } from '@nestjs/testing';
import { GrouppostResolver } from './group-post.resolver';
import { GrouppostService } from './group-post.service';

describe('GrouppostResolver', () => {
  let resolver: GrouppostResolver;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [GrouppostResolver, GrouppostService],
    }).compile();

    resolver = module.get<GrouppostResolver>(GrouppostResolver);
  });

  it('should be defined', () => {
    expect(resolver).toBeDefined();
  });
});
