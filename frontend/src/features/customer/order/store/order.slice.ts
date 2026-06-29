import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { AvailableVoucher } from "@features/customer/voucher/types/customer.type";

interface OrderState {
  selectedVoucherId: string | null;
}

const initialState: OrderState = {
  selectedVoucherId: null,
};

const orderSlice = createSlice({
  name: "order",
  initialState,
  reducers: {
    setSelectedVoucherId: (state, action: PayloadAction<string | null>) => {
      state.selectedVoucherId = action.payload;
    },

    clearSelectedVoucher: (state) => {
      state.selectedVoucherId = null;
    },
  },
});

export const { setSelectedVoucherId, clearSelectedVoucher } =
  orderSlice.actions;
export default orderSlice.reducer;
