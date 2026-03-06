import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axiosInstance from '../../api/axiosInstance';

interface SubscriptionState {
  isPremium: boolean;
  plan: string | null;
  expiryDate: string | null;
}

const initialState: SubscriptionState = {
  isPremium: false,
  plan: null,
  expiryDate: null,
};

export const checkSubscription = createAsyncThunk(
  'subscription/check',
  async () => {
    const res = await axiosInstance.get('/subscription');
    return res.data;
  },
);

export const purchasePlan = createAsyncThunk(
  'subscription/purchase',
  async (planId: string) => {
    const res = await axiosInstance.post('/subscription/purchase', {
      planId,
    });
    return res.data;
  },
);

const subscriptionSlice = createSlice({
  name: 'subscription',
  initialState,
  reducers: {},
  extraReducers: builder => {
    builder
      .addCase(checkSubscription.fulfilled, (state, action) => {
        state.isPremium = action.payload.isPremium;
        state.plan = action.payload.plan;
        state.expiryDate = action.payload.expiryDate;
      })

      .addCase(purchasePlan.fulfilled, (state, action) => {
        state.isPremium = true;
        state.plan = action.payload.plan;
        state.expiryDate = action.payload.expiryDate;
      });
  },
});

export default subscriptionSlice.reducer;
