import { createSlice } from '@reduxjs/toolkit';

interface AppState {
  onboardingCompleted: boolean;
  isLoading: boolean;
}

const initialState: AppState = {
  onboardingCompleted: false,
  isLoading: false,
};

const appSlice = createSlice({
  name: 'app',
  initialState,
  reducers: {
    completeOnboarding(state) {
      state.onboardingCompleted = true;
    },

    startLoading(state) {
      state.isLoading = true;
    },

    stopLoading(state) {
      state.isLoading = false;
    },
  },
});

export const { completeOnboarding, startLoading, stopLoading } =
  appSlice.actions;

export default appSlice.reducer;
