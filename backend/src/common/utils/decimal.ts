import { Prisma } from '@prisma/client';

export class DecimalUtil {
  static toNumber(value: Prisma.Decimal | number | string): number {
    return new Prisma.Decimal(value).toNumber();
  }

  static add(a: Prisma.Decimal, b: Prisma.Decimal) {
    return a.plus(b);
  }

  static mul(a: Prisma.Decimal, b: Prisma.Decimal | number) {
    return a.mul(b);
  }

  static sub(a: Prisma.Decimal, b: Prisma.Decimal) {
    return a.minus(b);
  }

  static div(a: Prisma.Decimal, b: Prisma.Decimal) {
    return a.div(b);
  }
}
