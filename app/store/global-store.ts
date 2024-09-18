import { configureStore } from "@reduxjs/toolkit";
import globalSlice from "./global-slice";

export const store = configureStore({
  reducer: {
    global: globalSlice,
  },
});
