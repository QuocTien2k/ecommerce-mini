import { OrderStatus } from '@prisma/client';

export const ORDER_STATUS_LABEL: Record<OrderStatus, string> = {
  PENDING: 'Chờ xác nhận',
  CONFIRMED: 'Đã xác nhận',
  PROCESSING: 'Đang xử lý',
  READY_TO_SHIP: 'Đã ra kho',
  SHIPPING: 'Đang giao',
  DELIVERED: 'Đã giao thành công',
  DELIVERY_FAILED: 'Giao hàng thất bại',
  CANCELLED: 'Đã hủy',
};
