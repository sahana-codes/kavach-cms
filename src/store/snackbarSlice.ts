import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface SnackbarState {
  open: boolean;
  message: string;
  severity: 'success' | 'error' | 'warning' | 'info';
}

const initialState: SnackbarState = {
  open: false,
  message: '',
  severity: 'info',
};

export const snackbarSlice = createSlice({
  name: 'snackbar',
  initialState,
  reducers: {
    openSnackbar: (
      state,
      action: PayloadAction<{
        message: string;
        severity: 'success' | 'error' | 'warning' | 'info';
      }>
    ) => {
      state.open = true;
      state.message = action.payload.message;
      state.severity = action.payload.severity;
    },
    closeSnackbar: (state) => {
      state.open = false;
    },
  },
});

export const { openSnackbar, closeSnackbar } = snackbarSlice.actions;

export default snackbarSlice.reducer;
