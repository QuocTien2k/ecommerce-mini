import { DecimalUtil } from '@common/utils/decimal';
import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { OrderStatus, PaymentMethod, PaymentStatus } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';
import {
  VNPay,
  ProductCode,
  VnpLocale,
  dateFormat,
  HashAlgorithm,
} from 'vnpay';

@Injectable()
export class PaymentService {
  constructor(
    private prisma: PrismaService,
    private configService: ConfigService,
  ) {}

  /* CASE VNPAY*/
  assertValidVnpayQuery(
    query: VnpayQueryRaw,
  ): asserts query is VnpayQueryRaw & {
    vnp_TxnRef: string;
    vnp_ResponseCode: string;
    vnp_OrderInfo: string;
    vnp_Amount: string;
  } {
    if (
      !query.vnp_TxnRef ||
      !query.vnp_ResponseCode ||
      !query.vnp_OrderInfo ||
      !query.vnp_Amount
    ) {
      throw new BadRequestException('Invalid VNPay query');
    }
  }

  async createVnpayPayment(userId: string, orderId: string, ipAddr: string) {
    const order = await this.prisma.order.findFirst({
      where: {
        id: orderId,
        userId,
      },
    });

    if (!order) {
      throw new NotFoundException('Order not found');
    }

    if (order.status !== OrderStatus.PENDING) {
      throw new BadRequestException('Order is not valid for payment');
    }

    const now = new Date();
    //expire time (15 phút)
    const expireDate = new Date(now);
    expireDate.setMinutes(expireDate.getMinutes() + 15);

    //Transaction
    const payment = await this.prisma.$transaction(async (tx) => {
      // check existing payment
      const existing = await tx.payment.findUnique({
        where: { orderId: order.id },
      });

      if (existing) {
        if (existing.status === 'SUCCESS') {
          throw new BadRequestException('Order already paid');
        }

        if (existing.status === PaymentStatus.PENDING) {
          // check expired
          if (!existing.expiredAt || existing.expiredAt > now) {
            return existing; // reuse nếu còn hạn
          }

          // hết hạn → delete để tạo mới
          await tx.payment.delete({
            where: { id: existing.id },
          });
        } else {
          // FAILED / CANCELLED
          await tx.payment.delete({
            where: { id: existing.id },
          });
        }
      }

      // unique transactionRef per attempt
      const transactionRef = `${order.id}-${Date.now()}`;

      // create
      return tx.payment.create({
        data: {
          orderId: order.id,
          userId,
          method: PaymentMethod.VNPAY,
          status: PaymentStatus.PENDING,
          amount: order.totalPrice,
          transactionRef,
          expiredAt: expireDate,
        },
      });
    });

    //Init VNPay
    const vnpay = new VNPay({
      tmnCode: this.configService.getOrThrow('VNPAY_TMN_CODE'),
      secureSecret: this.configService.getOrThrow('VNPAY_HASH_SECRET'),
      vnpayHost: this.configService.getOrThrow('VNPAY_URL'),
      testMode: this.configService.get('NODE_ENV') !== 'production',
      hashAlgorithm: HashAlgorithm.SHA512,
    });

    //Build URL
    const paymentUrl = vnpay.buildPaymentUrl({
      vnp_Amount: order.totalPrice.toNumber() * 100,
      vnp_IpAddr: ipAddr,
      vnp_TxnRef: payment.transactionRef,
      vnp_OrderInfo: `Thanh toan don hang ${order.id}`,
      vnp_OrderType: ProductCode.Other,
      vnp_ReturnUrl: this.configService.getOrThrow('VNPAY_RETURN_URL'),
      vnp_Locale: VnpLocale.VN,
      vnp_CreateDate: dateFormat(new Date()),
      vnp_ExpireDate: dateFormat(expireDate),
    });

    return {
      paymentUrl,
      paymentId: payment.id,
    };
  }

  async handleVnpayIpn(query: VnpayQueryRaw) {
    //Init VNPay
    const vnpay = new VNPay({
      tmnCode: this.configService.getOrThrow('VNPAY_TMN_CODE'),
      secureSecret: this.configService.getOrThrow('VNPAY_HASH_SECRET'),
      vnpayHost: this.configService.getOrThrow('VNPAY_URL'),
      hashAlgorithm: HashAlgorithm.SHA512,
    });

    //Verify checksum
    this.assertValidVnpayQuery(query);
    const isValid = vnpay.verifyReturnUrl(query);

    if (!isValid) {
      return {
        RspCode: '97',
        Message: 'Invalid checksum',
      };
    }

    const {
      vnp_TxnRef,
      vnp_ResponseCode,
      vnp_TransactionNo,
      vnp_PayDate,
      vnp_Amount,
    } = query;

    if (!vnp_TxnRef || !vnp_ResponseCode) {
      return { RspCode: '99', Message: 'Invalid request data' };
    }

    //Find payment
    const payment = await this.prisma.payment.findUnique({
      where: { transactionRef: vnp_TxnRef },
      include: { order: true },
    });

    if (!payment) {
      return {
        RspCode: '01',
        Message: 'Payment not found',
      };
    }

    const now = new Date();

    //Idempotency (đã xử lý rồi thì thôi)
    if (payment.status === PaymentStatus.SUCCESS) {
      return { RspCode: '00', Message: 'Already confirmed' };
    }

    //Check expired
    if (payment.expiredAt && payment.expiredAt < now) {
      await this.prisma.payment.update({
        where: { id: payment.id },
        data: {
          status: PaymentStatus.FAILED,
          rawResponse: query,
        },
      });

      return { RspCode: '02', Message: 'Payment expired' };
    }

    const vnpAmount = Number(vnp_Amount ?? 0);
    const expectedAmount = DecimalUtil.mul(payment.amount, 100).toNumber();

    if (vnpAmount !== expectedAmount) {
      return { RspCode: '04', Message: 'Invalid amount' };
    }

    // Order already processed
    if (payment.order.status !== OrderStatus.PENDING) {
      return { RspCode: '00', Message: 'Order already processed' };
    }

    //Xử lý theo response code
    if (vnp_ResponseCode === '00') {
      const result = await this.prisma.$transaction(async (tx) => {
        const updatedPayment = await tx.payment.updateMany({
          where: {
            id: payment.id,
            status: PaymentStatus.PENDING,
          },
          data: {
            status: PaymentStatus.SUCCESS,
            gatewayTransactionId: vnp_TransactionNo,
            paidAt: now,
            rawResponse: query,
          },
        });

        // Nếu không update được → đã bị race condition xử lý trước
        if (updatedPayment.count === 0) {
          return false;
        }

        await tx.order.update({
          where: { id: payment.orderId },
          data: { status: OrderStatus.CONFIRMED },
        });

        return true;
      });

      return {
        RspCode: '00',
        Message: result ? 'Confirm Success' : 'Already processed',
      };
    } else {
      // FAILED
      await this.prisma.payment.updateMany({
        where: {
          id: payment.id,
          status: PaymentStatus.PENDING,
        },
        data: {
          status: PaymentStatus.FAILED,
          rawResponse: query,
        },
      });

      return { RspCode: '00', Message: 'Confirm Failed' };
    }
  }

  async handleVnpayReturn(query: VnpayQueryRaw) {
    const vnpay = new VNPay({
      tmnCode: this.configService.getOrThrow('VNPAY_TMN_CODE'),
      secureSecret: this.configService.getOrThrow('VNPAY_HASH_SECRET'),
      vnpayHost: this.configService.getOrThrow('VNPAY_URL'),
      hashAlgorithm: HashAlgorithm.SHA512,
    });

    // Verify checksum
    this.assertValidVnpayQuery(query);
    const isValid = vnpay.verifyReturnUrl(query);

    if (!isValid) {
      return {
        success: false,
        message: 'Invalid signature',
      };
    }

    const { vnp_TxnRef } = query;

    const payment = await this.prisma.payment.findUnique({
      where: { transactionRef: vnp_TxnRef },
    });

    if (!payment) {
      return { success: false, message: 'Payment not found' };
    }

    //Không update chỉ đọc trạng thái đã được IPN xử lý
    switch (payment.status) {
      case PaymentStatus.SUCCESS:
        return {
          success: true,
          message: 'Payment successful',
          orderId: payment.orderId,
        };

      case PaymentStatus.PENDING:
        return {
          success: false,
          message: 'Payment processing, please wait',
        };

      case PaymentStatus.FAILED:
      case PaymentStatus.CANCELLED:
        return {
          success: false,
          message: 'Payment failed',
        };

      default:
        return {
          success: false,
          message: 'Unknown status',
        };
    }
  }

  async getPaymentStatus(orderId: string, userId: string) {
    const order = await this.prisma.order.findFirst({
      where: {
        id: orderId,
        userId,
      },
      include: {
        payment: true,
      },
    });

    if (!order) {
      throw new NotFoundException('Order not found');
    }

    const payment = order.payment;

    if (!payment) {
      return {
        status: 'UNPAID',
        message: 'No payment created',
      };
    }

    switch (payment.status) {
      case PaymentStatus.SUCCESS:
        return {
          status: 'SUCCESS',
          message: 'Payment successful',
          orderId: order.id,
        };

      case PaymentStatus.PENDING:
        return {
          status: 'PENDING',
          message: 'Payment is processing',
        };

      case PaymentStatus.FAILED:
        return {
          status: 'FAILED',
          message: 'Payment failed',
        };

      case PaymentStatus.CANCELLED:
        return {
          status: 'CANCELLED',
          message: 'Payment cancelled',
        };

      default:
        return {
          status: 'UNKNOWN',
          message: 'Unknown payment status',
        };
    }
  }
}
