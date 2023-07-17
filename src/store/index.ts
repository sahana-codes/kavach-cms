import { configureStore, ThunkAction, Action } from '@reduxjs/toolkit';
import adminReducer from './adminSlice';

// Define the root state type
export type RootState = ReturnType<typeof store.getState>;

// Define the AppThunk type for thunks
export type AppThunk<ReturnType = void> = ThunkAction<
  ReturnType,
  RootState,
  unknown,
  Action<string>
>;

// Define the AppDispatch type
export type AppDispatch = typeof store.dispatch;

// Create the store with the admin reducer
const store = configureStore({
  reducer: {
    admin: adminReducer,
  },
});

export default store;
