import type { GetOrdersQuery } from "@shared/types/order.type";
import { adminOrderApi } from "../api/adminOrder.api";
import { downloadFile } from "@/utils/download-file";

export const useExportOrders = () => {
  const exportOrders = async (params?: GetOrdersQuery) => {
    const response = await adminOrderApi.exportOrders(params);

    const filename =
      response.headers["content-disposition"]?.match(/filename="(.+)"/)?.[1] ??
      "orders.xlsx";

    downloadFile(response.data, filename);
  };

  return { exportOrders };
};
