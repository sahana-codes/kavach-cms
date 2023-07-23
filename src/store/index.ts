import {
  configureStore,
  ThunkAction,
  Action,
  combineReducers,
} from '@reduxjs/toolkit';
import adminReducer from './adminSlice';
import contentReducer from './contentSlice';
import snackbarReducer from './snackbarSlice';
import storage from 'redux-persist/lib/storage';
import { persistReducer, persistStore } from 'redux-persist';

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

const persistConfig = {
  key: 'root',
  storage,
  whitelist: ['admin', 'content'],
  blacklist: ['snackbar'],
};

const rootReducer = combineReducers({
  admin: adminReducer,
  content: contentReducer,
  snackbar: snackbarReducer,
});

const persistedReducer = persistReducer(persistConfig, rootReducer);

// Create the store with the admin reducer
const store = configureStore({
  reducer: persistedReducer,
  devTools: import.meta.env.REACT_APP_API_ENV !== 'production',
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});

export const persistor = persistStore(store);

export default store;
