import { Test, TestingModule } from '@nestjs/testing';
import { GrouppostService } from './group-post.service';

describe('GrouppostService', () => {
  let service: GrouppostService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [GrouppostService],
    }).compile();

    service = module.get<GrouppostService>(GrouppostService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
