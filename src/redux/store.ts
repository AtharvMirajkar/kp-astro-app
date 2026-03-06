import { configureStore } from '@reduxjs/toolkit';
import {
  kundaliReducer,
  subscriptionReducer,
  appReducer,
  authReducer,
} from './slices';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    kundali: kundaliReducer,
    subscription: subscriptionReducer,
    app: appReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
