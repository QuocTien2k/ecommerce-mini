import { Test, TestingModule } from '@nestjs/testing';
import { CartPricingController } from './cart-pricing.controller';

describe('CartPricingController', () => {
  let controller: CartPricingController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CartPricingController],
    }).compile();

    controller = module.get<CartPricingController>(CartPricingController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
