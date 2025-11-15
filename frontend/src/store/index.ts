import { configureStore } from "@reduxjs/toolkit";
import monitoringReducer from "../features/monitoring/monitoringSlice";

export const store = configureStore({
  reducer: {
    monitoring: monitoringReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
