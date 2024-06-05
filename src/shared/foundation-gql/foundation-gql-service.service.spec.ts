import { Test, TestingModule } from '@nestjs/testing';
import { FoundationGqlService } from './foundation-gql.service';

describe('FoundationGqlServiceService', () => {
  let service: FoundationGqlService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [FoundationGqlService],
    }).compile();

    service = module.get<FoundationGqlService>(FoundationGqlService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
