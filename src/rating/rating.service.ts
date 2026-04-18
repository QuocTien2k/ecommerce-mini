import { Injectable } from '@nestjs/common';
import { OrderService } from '@order/order.service';
import { PrismaService } from '@prisma/prisma.service';

@Injectable()
export class RatingService {
  constructor(
    private prisma: PrismaService,
    private orderService: OrderService,
  ) {}
}
