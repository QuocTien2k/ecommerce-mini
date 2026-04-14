type VnpayQueryRaw = {
  vnp_TxnRef?: string;
  vnp_ResponseCode?: string;
  vnp_OrderInfo?: string;
  vnp_Amount?: string;

  vnp_TransactionNo?: string;
  vnp_PayDate?: string;

  [key: string]: string | undefined;
};
