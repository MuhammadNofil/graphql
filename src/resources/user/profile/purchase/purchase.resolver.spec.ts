import { Test, TestingModule } from '@nestjs/testing';
import { PurchaseResolver } from './purchase.resolver';
import { PurchaseService } from './purchase.service';

describe('PurchaseResolver', () => {
  let resolver: PurchaseResolver;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [PurchaseResolver, PurchaseService],
    }).compile();

    resolver = module.get<PurchaseResolver>(PurchaseResolver);
  });

  it('should be defined', () => {
    expect(resolver).toBeDefined();
  });
});
