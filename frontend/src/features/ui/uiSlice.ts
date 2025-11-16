/* eslint-disable @typescript-eslint/no-unused-vars */

import { createSlice } from "@reduxjs/toolkit";

type SnackbarPayload = {
  message: string;
  variant?: "success" | "error" | "info" | "warning";
};

type UiState = object;

const initialState: UiState = {};

export const uiSlice = createSlice({
  name: "ui",
  initialState,
  reducers: {
    noop() {
      return initialState;
    },
  },
});

export default uiSlice.reducer;
