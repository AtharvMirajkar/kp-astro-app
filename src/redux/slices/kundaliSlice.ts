import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import axiosInstance from '../../api/axiosInstance';
import axios from 'axios';
import i18n from '../../i18n'; // your existing i18n instance

// ─── FCM imports ──────────────────────────────────────────────────────────────
import {
  requestNotificationPermission,
  getOrCreateDeviceId,
  getFCMToken,
} from '../../services/notificationService';

// ─── Types ────────────────────────────────────────────────────────────────────

interface KundaliState {
  currentKundali: any | null;
  kundaliList: any[];
  birthDetails: BirthDetails | null;
  loading: boolean;
  userRecordId: string | null;
  deviceId: string | null;
  fcmToken: string | null;
}

interface BirthDetails {
  name: string;
  dob: string;
  tob: string;
  place: string;
  latitude: string;
  longitude: string;
  gender: string;
}

// ─── Initial state ────────────────────────────────────────────────────────────

const initialState: KundaliState = {
  currentKundali: null,
  kundaliList: [],
  birthDetails: null,
  loading: false,
  userRecordId: null,
  deviceId: null,
  fcmToken: null,
};

// ─── Language helper ──────────────────────────────────────────────────────────

type SupportedLanguage = 'en' | 'hi' | 'mr';

const SUPPORTED_LANGUAGES: SupportedLanguage[] = ['en', 'hi', 'mr'];

function getApiLanguage(): SupportedLanguage {
  // i18n.language can be "en", "hi", "mr", or locale variants like "en-US"
  const lang = i18n.language?.split('-')[0];
  return SUPPORTED_LANGUAGES.includes(lang as SupportedLanguage)
    ? (lang as SupportedLanguage)
    : 'en';
}

// ─── generateKundali ─────────────────────────────────────────────────────────

export const generateKundali = createAsyncThunk(
  'kundali/generate',
  async (birthDetails: {
    name: string;
    dob: string;
    tob: string;
    place: string;
    latitude: string;
    longitude: string;
  }) => {
    const language = getApiLanguage();

    const payload = {
      date: birthDetails.dob,
      time: birthDetails.tob,
      latitude: Number(birthDetails.latitude),
      longitude: Number(birthDetails.longitude),
      timezone: 'Asia/Kolkata',
    };

    console.log(`[generateKundali] Language: ${language}`);

    const res = await axios.post(
      `https://kp-astro-engine.onrender.com/generate-chart?language=${language}`,
      payload,
    );
    return res.data;
  },
);

// ─── fetchKundaliList ─────────────────────────────────────────────────────────

export const fetchKundaliList = createAsyncThunk('kundali/list', async () => {
  const res = await axiosInstance.get('/kundali');
  return res.data;
});

// ─── fetchKundaliOverview ─────────────────────────────────────────────────────

export const fetchKundaliOverview = createAsyncThunk(
  'kundali/overview',
  async (kundaliId: string) => {
    const res = await axiosInstance.get(`/kundali/${kundaliId}`);
    return res.data;
  },
);

// ─── saveBirthDetails ────────────────────────────────────────────────────────

export const saveBirthDetails = createAsyncThunk(
  'kundali/saveBirthDetails',
  async (details: BirthDetails, { rejectWithValue }) => {
    try {
      await requestNotificationPermission();

      const [deviceId, fcmToken] = await Promise.all([
        getOrCreateDeviceId(),
        getFCMToken(),
      ]);

      const response = await axiosInstance.post('/api/users', {
        name: details.name,
        gender: details.gender,
        dateOfBirth: details.dob,
        timeOfBirth: details.tob,
        placeOfBirth: details.place,
        deviceId: deviceId,
        fcmToken: fcmToken ?? '',
      });

      return {
        details,
        deviceId,
        fcmToken: fcmToken ?? '',
        userRecordId:
          response.data?.data?._id ?? response.data?.data?.id ?? null,
      };
    } catch (error: any) {
      console.error('[saveBirthDetails] Error:', error);
      console.log('[saveBirthDetails] Response:', error?.response?.data);
      return rejectWithValue(
        error?.response?.data?.message ?? 'Failed to save birth details',
      );
    }
  },
);

// ─── Slice ────────────────────────────────────────────────────────────────────

const kundaliSlice = createSlice({
  name: 'kundali',
  initialState,
  reducers: {
    setBirthDetails(state, action: PayloadAction<BirthDetails>) {
      state.birthDetails = action.payload;
    },
    updateFCMToken(state, action: PayloadAction<string>) {
      state.fcmToken = action.payload;
    },
  },
  extraReducers: builder => {
    builder
      .addCase(generateKundali.pending, state => {
        state.loading = true;
      })
      .addCase(generateKundali.fulfilled, (state, action) => {
        state.loading = false;
        state.currentKundali = action.payload;
      })

      .addCase(fetchKundaliList.fulfilled, (state, action) => {
        state.kundaliList = action.payload;
      })

      .addCase(fetchKundaliOverview.fulfilled, (state, action) => {
        state.currentKundali = action.payload;
      })

      .addCase(saveBirthDetails.pending, state => {
        state.loading = true;
      })
      .addCase(saveBirthDetails.fulfilled, (state, action) => {
        state.loading = false;
        state.birthDetails = action.payload.details;
        state.deviceId = action.payload.deviceId;
        state.fcmToken = action.payload.fcmToken;
        state.userRecordId = action.payload.userRecordId;
      })
      .addCase(saveBirthDetails.rejected, state => {
        state.loading = false;
      });
  },
});

export const { setBirthDetails, updateFCMToken } = kundaliSlice.actions;
export default kundaliSlice.reducer;
