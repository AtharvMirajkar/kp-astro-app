import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axiosInstance from '../../api/axiosInstance';


interface User {
  id: string;
  name: string;
  email: string;
  language: 'en' | 'hi' | 'mr';
}

interface AuthState {
  token: string | null;
  deviceId: string | null;
  authMode: 'guest' | 'user' | null;
  user: User | null;
  loading: boolean;
  error: string | null;
}

const initialState: AuthState = {
  token: null,
  deviceId: null,
  authMode: null,
  user: null,
  loading: false,
  error: null,
};

export const guestLogin = createAsyncThunk(
  'auth/guestLogin',
  async (deviceId: string) => {
    const res = await axiosInstance.post('/auth/guest', { deviceId });
    return res.data;
  },
);

export const loginUser = createAsyncThunk(
  'auth/loginUser',
  async (payload: { email: string; password: string }) => {
    const res = await axiosInstance.post('/auth/login', payload);
    return res.data;
  },
);

export const sendOtp = createAsyncThunk(
  'auth/sendOtp',
  async (email: string) => {
    const res = await axiosInstance.post('/auth/send-otp', { email });
    return res.data;
  },
);

export const verifyOtp = createAsyncThunk(
  'auth/verifyOtp',
  async (payload: { email: string; otp: string }) => {
    const res = await axiosInstance.post('/auth/verify-otp', payload);
    return res.data;
  },
);

export const resetPassword = createAsyncThunk(
  'auth/resetPassword',
  async (payload: { email: string; password: string }) => {
    const res = await axiosInstance.post('/auth/reset-password', payload);
    return res.data;
  },
);

export const updateLanguage = createAsyncThunk(
  'auth/updateLanguage',
  async (language: 'en' | 'hi' | 'mr') => {
    await axiosInstance.post('/user/language', { language });
    return language;
  },
);

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    logout(state) {
      state.token = null;
      state.user = null;
      state.authMode = null;
    },
  },
  extraReducers: builder => {
    builder
      .addCase(guestLogin.fulfilled, (state, action) => {
        state.authMode = 'guest';
        state.deviceId = action.payload.deviceId;
      })

      .addCase(loginUser.fulfilled, (state, action) => {
        state.token = action.payload.token;
        state.user = action.payload.user;
        state.authMode = 'user';
      })

      .addCase(updateLanguage.fulfilled, (state, action) => {
        if (state.user) {
          state.user.language = action.payload;
        }
      });
  },
});

export const { logout } = authSlice.actions;
export default authSlice.reducer;
