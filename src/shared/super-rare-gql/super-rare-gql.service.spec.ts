import { Test, TestingModule } from '@nestjs/testing';
import { SuperRareGqlService } from './super-rare-gql.service';

describe('SuperRareGqlService', () => {
  let service: SuperRareGqlService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [SuperRareGqlService],
    }).compile();

    service = module.get<SuperRareGqlService>(SuperRareGqlService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
