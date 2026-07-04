export class DashboardOrderStatusDto {
  pending: number;
  confirmed: number;
  processing: number;
  readyToShip: number;
  shipping: number;
  delivered: number;
  cancelled: number;
}
