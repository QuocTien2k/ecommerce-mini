import { ConfigService } from '@nestjs/config';
import { HashAlgorithm, VNPay } from 'vnpay';

export const VNPayProvider = {
  provide: 'VNPAY_CLIENT',
  inject: [ConfigService],
  useFactory: (config: ConfigService) => {
    return new VNPay({
      tmnCode: config.getOrThrow('VNPAY_TMN_CODE'),
      secureSecret: config.getOrThrow('VNPAY_HASH_SECRET'),
      vnpayHost: config.getOrThrow('VNPAY_URL'),
      hashAlgorithm: HashAlgorithm.SHA512,
    });
  },
};
