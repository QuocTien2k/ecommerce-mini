import { Type } from 'class-transformer';
import { IsInt, IsString } from 'class-validator';

export class MomoCallbackDto {
  @IsString()
  partnerCode: string;

  @IsString()
  orderId: string;

  @IsString()
  requestId: string;

  @IsString()
  amount: string;

  @IsString()
  orderInfo: string;

  @IsString()
  orderType: string;

  @IsString()
  transId: string;

  @Type(() => Number)
  @IsInt()
  resultCode: number;

  @IsString()
  message: string;

  @IsString()
  payType: string;

  @IsString()
  responseTime: string;

  @IsString()
  extraData: string;

  @IsString()
  signature: string;
}

export class MomoIpnDto extends MomoCallbackDto {}
export class MomoReturnDto extends MomoCallbackDto {}
