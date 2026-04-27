import { createSlice } from "@reduxjs/toolkit";
import type { RootState } from "@/app/store";

type LoadingState = {
  count: number;
};

const initialState: LoadingState = {
  count: 0,
};

const loadingSlice = createSlice({
  name: "loading",
  initialState,
  reducers: {
    startLoading: (state) => {
      state.count += 1;
    },
    stopLoading: (state) => {
      state.count = Math.max(0, state.count - 1);
    },
    resetLoading: (state) => {
      state.count = 0;
    },
  },
});

export const { startLoading, stopLoading, resetLoading } = loadingSlice.actions;

export const selectIsLoading = (state: RootState) => state.loading.count > 0;

export default loadingSlice.reducer;
