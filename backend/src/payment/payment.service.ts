import { DecimalUtil } from '@common/utils/decimal';
import {
  BadRequestException,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import {
  Order,
  OrderStatus,
  Payment,
  PaymentMethod,
  PaymentStatus,
  Prisma,
} from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';
import { VNPay, ProductCode, VnpLocale, dateFormat } from 'vnpay';
import { HttpService } from '@nestjs/axios';
import * as crypto from 'crypto';
import { MomoCallbackDto, MomoReturnDto } from './types/momo.type';

@Injectable()
export class PaymentService {
  constructor(
    private prisma: PrismaService,
    private configService: ConfigService,
    private readonly httpService: HttpService,
    @Inject('VNPAY_CLIENT') private readonly vnpay: VNPay,
  ) {}

  private async clearUserCart(tx: Prisma.TransactionClient, userId: string) {
    await tx.cartItem.deleteMany({
      where: {
        userId,
      },
    });
  }

  private async confirmOrderAndClearCart(
    tx: Prisma.TransactionClient,
    orderId: string,
    userId: string,
  ) {
    // Update order status
    await tx.order.update({
      where: { id: orderId },
      data: { status: OrderStatus.CONFIRMED },
    });

    // Clear cart
    await this.clearUserCart(tx, userId);
  }

  private async createOrReusePayment(
    tx: Prisma.TransactionClient,
    order: Order,
    userId: string,
    method: PaymentMethod,
    now: Date,
    expireDate: Date,
  ): Promise<Payment> {
    const existing = await tx.payment.findUnique({
      where: {
        orderId: order.id,
      },
    });

    if (existing) {
      if (existing.status === PaymentStatus.SUCCESS) {
        throw new BadRequestException('Order already paid');
      }

      if (existing.status === PaymentStatus.PENDING) {
        if (!existing.expiredAt || existing.expiredAt > now) {
          return existing;
        }

        await tx.payment.delete({
          where: {
            id: existing.id,
          },
        });
      } else {
        await tx.payment.delete({
          where: {
            id: existing.id,
          },
        });
      }
    }

    const transactionRef = `${order.id}-${Date.now()}`;

    return tx.payment.create({
      data: {
        orderId: order.id,
        userId,
        method,
        status: PaymentStatus.PENDING,
        amount: order.totalPrice,
        transactionRef,
        expiredAt: expireDate,
      },
    });
  }

  /*Case COD*/
  async createCodPayment(
    userId: string,
    orderId: string,
  ): Promise<{ paymentId: string }> {
    const order = await this.prisma.order.findFirst({
      where: {
        id: orderId,
        userId,
      },
    });

    if (!order) {
      throw new NotFoundException('Không tìm thấy đơn hàng');
    }

    if (order.status !== OrderStatus.PENDING) {
      throw new BadRequestException('Đơn hàng không hợp lệ!');
    }

    const payment = await this.prisma.$transaction(async (tx) => {
      const existing = await tx.payment.findUnique({
        where: { orderId: order.id },
      });

      if (existing) {
        if (existing.status === PaymentStatus.SUCCESS) {
          throw new BadRequestException('Đơn hàng đã được thanh toán');
        }

        // FAILED / CANCELLED / PENDING → recreate
        await tx.payment.delete({
          where: { id: existing.id },
        });
      }

      const newPayment = await tx.payment.create({
        data: {
          orderId: order.id,
          userId,
          method: PaymentMethod.COD,
          status: PaymentStatus.SUCCESS, // COD thường success ngay
          amount: order.totalPrice,
          transactionRef: `COD-${order.id}-${Date.now()}`,
          paidAt: new Date(),
        },
      });

      // Confirm order + Clear cart
      await this.confirmOrderAndClearCart(tx, order.id, userId);

      return newPayment;
    });

    return {
      paymentId: payment.id,
    };
  }

  /* Case VNPAY*/
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

  async createVnpayPayment(
    userId: string,
    orderId: string,
    ipAddr: string,
  ): Promise<{ paymentUrl: string; paymentId: string }> {
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
    const payment = await this.prisma.$transaction((tx) =>
      this.createOrReusePayment(
        tx,
        order,
        userId,
        PaymentMethod.VNPAY,
        now,
        expireDate,
      ),
    );
    //console.log('VNPAY_URL ENV:', this.configService.get('VNPAY_URL'));

    // const vnpUrl = this.configService.get('VNPAY_URL');
    // console.log('VNPAY_URL ENV:', vnpUrl);

    //Build URL
    const paymentUrl = this.vnpay.buildPaymentUrl({
      vnp_Amount: order.totalPrice.toNumber(),
      vnp_IpAddr: ipAddr,
      vnp_TxnRef: payment.transactionRef,
      vnp_OrderInfo: `Thanh toan don hang ${order.id}`,
      vnp_OrderType: ProductCode.Other,
      vnp_ReturnUrl: this.configService.getOrThrow('VNPAY_RETURN_URL'),
      vnp_Locale: VnpLocale.VN,
      vnp_CreateDate: dateFormat(new Date()),
      vnp_ExpireDate: dateFormat(expireDate),
    });

    // console.log('FINAL PAYMENT URL:', paymentUrl);

    return {
      paymentUrl,
      paymentId: payment.id,
    };
  }

  async handleVnpayIpn(query: VnpayQueryRaw) {
    //Verify checksum
    this.assertValidVnpayQuery(query);
    const isValid = this.vnpay.verifyReturnUrl(query);

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

        await this.clearUserCart(tx, payment.userId);

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
    this.assertValidVnpayQuery(query);

    const isValid = this.vnpay.verifyReturnUrl(query);

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
      return {
        success: false,
        message: 'Payment not found',
      };
    }

    // DEV ONLY
    if (
      process.env.NODE_ENV === 'development' &&
      payment.status === PaymentStatus.PENDING
    ) {
      await this.handleVnpayIpn(query);
    }

    const latestPayment = await this.prisma.payment.findUnique({
      where: { transactionRef: vnp_TxnRef },
    });

    switch (latestPayment?.status) {
      case PaymentStatus.SUCCESS:
        return {
          success: true,
          message: 'Payment successful',
          orderId: latestPayment.orderId,
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

  async cancelPayment(
    tx: Prisma.TransactionClient,
    userId: string,
    orderId: string,
  ) {
    const now = new Date();

    const payment = await tx.payment.findFirst({
      where: {
        orderId,
        userId,
      },
      include: {
        order: true,
      },
      orderBy: { createdAt: 'desc' },
    });

    if (!payment) {
      throw new NotFoundException('Payment not found');
    }

    if (payment.status === PaymentStatus.CANCELLED) {
      return { success: true, message: 'Already cancelled' };
    }

    if (payment.status === PaymentStatus.SUCCESS) {
      throw new BadRequestException('Cannot cancel successful payment');
    }

    if (payment.expiredAt && payment.expiredAt < now) {
      await tx.payment.update({
        where: { id: payment.id },
        data: {
          status: PaymentStatus.FAILED, // nên là FAILED
          rawResponse: { reason: 'expired' },
        },
      });

      return { success: true, message: 'Expired payment' };
    }

    const result = await tx.payment.updateMany({
      where: {
        id: payment.id,
        status: PaymentStatus.PENDING,
      },
      data: {
        status: PaymentStatus.CANCELLED,
        rawResponse: { reason: 'user_cancelled' },
        cancelledAt: now,
      },
    });

    if (result.count === 0) {
      return {
        success: false,
        message: 'Payment already processed',
      };
    }

    return {
      success: true,
      message: 'Cancelled',
    };
  }

  async getPaymentStatus(userId: string, orderId: string) {
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

  /* Case MoMo */
  private get momoConfig() {
    return {
      endpoint: this.configService.getOrThrow('MOMO_ENDPOINT'),
      partnerCode: this.configService.getOrThrow('MOMO_PARTNER_CODE'),
      accessKey: this.configService.getOrThrow('MOMO_ACCESS_KEY'),
      secretKey: this.configService.getOrThrow('MOMO_SECRET_KEY'),
      partnerName: this.configService.getOrThrow('MOMO_PARTNER_NAME'),
      storeId: this.configService.getOrThrow('MOMO_STORE_ID'),
      redirectUrl: this.configService.getOrThrow('MOMO_REDIRECT_URL'),
      ipnUrl: this.configService.getOrThrow('MOMO_IPN_URL'),
    };
  }

  private async createOrReuseMomoPayment(
    tx: Prisma.TransactionClient,
    order: Order,
    userId: string,
    now: Date,
    expireDate: Date,
  ): Promise<Payment> {
    const existing = await tx.payment.findUnique({
      where: {
        orderId: order.id,
      },
    });

    if (existing) {
      if (existing.status === PaymentStatus.SUCCESS) {
        throw new BadRequestException('Order already paid');
      }

      if (existing.status === PaymentStatus.PENDING) {
        if (!existing.expiredAt || existing.expiredAt > now) {
          return existing;
        }

        await tx.payment.delete({
          where: {
            id: existing.id,
          },
        });
      } else {
        await tx.payment.delete({
          where: {
            id: existing.id,
          },
        });
      }
    }

    const transactionRef = `${order.id}-${Date.now()}`;

    return tx.payment.create({
      data: {
        orderId: order.id,
        userId,
        method: PaymentMethod.MOMO,
        status: PaymentStatus.PENDING,
        amount: order.totalPrice,
        transactionRef,
        expiredAt: expireDate,
      },
    });
  }

  private generateMomoCreateSignature(params: {
    amount: string;
    requestId: string;
    orderId: string;
    orderInfo: string;
    requestType: string;
    extraData: string;
  }): string {
    const momo = this.momoConfig;

    const rawSignature =
      `accessKey=${momo.accessKey}` +
      `&amount=${params.amount}` +
      `&extraData=${params.extraData}` +
      `&ipnUrl=${momo.ipnUrl}` +
      `&orderId=${params.orderId}` +
      `&orderInfo=${params.orderInfo}` +
      `&partnerCode=${momo.partnerCode}` +
      `&redirectUrl=${momo.redirectUrl}` +
      `&requestId=${params.requestId}` +
      `&requestType=${params.requestType}`;

    return crypto
      .createHmac('sha256', momo.secretKey)
      .update(rawSignature)
      .digest('hex');
  }

  private buildMomoCreateRequest(params: {
    requestId: string;
    orderId: string;
    amount: string;
    orderInfo: string;
    requestType: string;
    extraData: string;
    signature: string;
  }) {
    const momo = this.momoConfig;

    return {
      partnerCode: momo.partnerCode,
      partnerName: momo.partnerName,
      storeId: momo.storeId,
      requestId: params.requestId,
      amount: params.amount,
      orderId: params.orderId,
      orderInfo: params.orderInfo,
      redirectUrl: momo.redirectUrl,
      ipnUrl: momo.ipnUrl,
      lang: 'vi',
      requestType: params.requestType,
      autoCapture: true,
      extraData: params.extraData,
      signature: params.signature,
    };
  }

  private async createMomoGatewayPayment(requestBody: Record<string, any>) {
    const { data } = await this.httpService.axiosRef.post(
      this.momoConfig.endpoint,
      requestBody,
    );

    return data;
  }

  async createMomoPayment(
    userId: string,
    orderId: string,
  ): Promise<{ paymentUrl: string; paymentId: string }> {
    const order = await this.prisma.order.findFirst({
      where: {
        id: orderId,
        userId,
      },
    });

    if (!order) {
      throw new NotFoundException('Không tìm thấy đơn hàng');
    }

    if (order.status !== OrderStatus.PENDING) {
      throw new BadRequestException('Order is not valid for payment');
    }

    const now = new Date();
    //expire time (15 phút)
    const expireDate = new Date(now);
    expireDate.setMinutes(expireDate.getMinutes() + 15);

    //Transaction
    const payment = await this.prisma.$transaction((tx) =>
      this.createOrReusePayment(
        tx,
        order,
        userId,
        PaymentMethod.MOMO,
        now,
        expireDate,
      ),
    );

    const requestId = payment.transactionRef;
    const orderIdMomo = payment.transactionRef;
    const amount = payment.amount.toNumber().toString();
    const orderInfo = `Thanh toan don hang ${order.id}`;
    const requestType = 'payWithMethod';
    const extraData = '';

    const signature = this.generateMomoCreateSignature({
      amount,
      requestId,
      orderId: orderIdMomo,
      orderInfo,
      requestType,
      extraData,
    });

    const requestBody = this.buildMomoCreateRequest({
      requestId,
      orderId: orderIdMomo,
      amount,
      orderInfo,
      requestType,
      extraData,
      signature,
    });

    const data = await this.createMomoGatewayPayment(requestBody);

    if (data.resultCode !== 0) {
      await this.prisma.payment.delete({
        where: { id: payment.id },
      });

      throw new BadRequestException(
        data.message || 'Không thể tạo thanh toán MoMo',
      );
    }

    return {
      paymentUrl: data.payUrl,
      paymentId: payment.id,
    };
  }

  /* Momo return */
  private verifyMomoSignature(payload: MomoCallbackDto): boolean {
    const momo = this.momoConfig;

    const rawSignature =
      `accessKey=${momo.accessKey}` +
      `&amount=${payload.amount}` +
      `&extraData=${payload.extraData}` +
      `&message=${payload.message}` +
      `&orderId=${payload.orderId}` +
      `&orderInfo=${payload.orderInfo}` +
      `&orderType=${payload.orderType}` +
      `&partnerCode=${payload.partnerCode}` +
      `&payType=${payload.payType}` +
      `&requestId=${payload.requestId}` +
      `&responseTime=${payload.responseTime}` +
      `&resultCode=${payload.resultCode}` +
      `&transId=${payload.transId}`;

    const expectedSignature = crypto
      .createHmac('sha256', momo.secretKey)
      .update(rawSignature)
      .digest('hex');

    return expectedSignature === payload.signature;
  }

  private validateMomoIpn(
    payment: Payment,
    payload: MomoCallbackDto,
  ): { resultCode: number; message: string } | null {
    const momo = this.momoConfig;

    if (payment.amount.toNumber() !== Number(payload.amount)) {
      return {
        resultCode: 99,
        message: 'Invalid amount',
      };
    }

    if (payload.partnerCode !== momo.partnerCode) {
      return {
        resultCode: 98,
        message: 'Invalid partnerCode',
      };
    }

    return null;
  }

  private async processMomoPaymentResult(
    payment: Payment,
    resultCode: number,
  ): Promise<void> {
    if (resultCode === 0) {
      await this.prisma.$transaction(async (tx) => {
        await tx.payment.update({
          where: {
            id: payment.id,
          },
          data: {
            status: PaymentStatus.SUCCESS,
            paidAt: new Date(),
          },
        });

        await tx.order.update({
          where: {
            id: payment.orderId,
          },
          data: {
            status: OrderStatus.CONFIRMED,
          },
        });

        // Clear cart
        await this.clearUserCart(tx, payment.userId);
      });

      return;
    }

    await this.prisma.payment.update({
      where: {
        id: payment.id,
      },
      data: {
        status: PaymentStatus.FAILED,
      },
    });
  }

  async handleMomoIpn(payload: MomoCallbackDto) {
    //console.log('MoMo IPN', payload);
    if (!this.verifyMomoSignature(payload)) {
      return {
        resultCode: 97,
        message: 'Invalid signature',
      };
    }

    const { orderId, resultCode } = payload;

    const payment = await this.prisma.payment.findFirst({
      where: {
        transactionRef: orderId,
      },
      include: {
        order: true,
      },
    });

    if (!payment) {
      return {
        resultCode: 1,
        message: 'Payment not found',
      };
    }

    const validation = this.validateMomoIpn(payment, payload);

    if (validation) {
      return validation;
    }

    // idempotent
    if (payment.status === PaymentStatus.SUCCESS) {
      return {
        resultCode: 0,
        message: 'success',
      };
    }

    await this.processMomoPaymentResult(payment, resultCode);

    return {
      resultCode: 0,
      message: 'success',
    };
  }

  async handleMomoReturn(payload: MomoReturnDto) {
    return this.handleMomoIpn(payload);
  }
}
