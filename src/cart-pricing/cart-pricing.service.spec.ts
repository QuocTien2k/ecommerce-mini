import { Test, TestingModule } from '@nestjs/testing';
import { CartPricingService } from './cart-pricing.service';

describe('CartPricingService', () => {
  let service: CartPricingService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [CartPricingService],
    }).compile();

    service = module.get<CartPricingService>(CartPricingService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
