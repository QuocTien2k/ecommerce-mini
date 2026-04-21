import type { AppDispatch, RootState } from "@/app/store";
import {
  useDispatch,
  useSelector,
  type TypedUseSelectorHook,
} from "react-redux";

// typed dispatch
export const useAppDispatch = () => useDispatch<AppDispatch>();

// typed selector
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
