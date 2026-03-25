import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axiosInstance from '../../api/axiosInstance';
import axios from 'axios';
import i18n from '../../i18n';

import {
  requestNotificationPermission,
  getOrCreateDeviceId,
  getFCMToken,
} from '../../services/notificationService';

// ─── Persistence keys (shared with RootNavigator) ─────────────────────────────

const STORAGE_KEYS = {
  BIRTH_DETAILS: '@kp_birth_details',
  CURRENT_KUNDALI: '@kp_current_kundali',
} as const;

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
  const lang = i18n.language?.split('-')[0];
  return SUPPORTED_LANGUAGES.includes(lang as SupportedLanguage)
    ? (lang as SupportedLanguage)
    : 'en';
}

// ─── EXISTING: generateKundali ────────────────────────────────────────────────

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

    console.log(payload, '<------- Payload');
    console.log(`[generateKundali] Language: ${language}`);

    const res = await axios.post(
      `https://kp-astro-engine.onrender.com/generate-chart?language=${language}`,
      payload,
    );
    return res.data;
  },
);

// ─── EXISTING: fetchKundaliList ───────────────────────────────────────────────

export const fetchKundaliList = createAsyncThunk('kundali/list', async () => {
  const res = await axiosInstance.get('/kundali');
  return res.data;
});

// ─── EXISTING: fetchKundaliOverview ──────────────────────────────────────────

export const fetchKundaliOverview = createAsyncThunk(
  'kundali/overview',
  async (kundaliId: string) => {
    const res = await axiosInstance.get(`/kundali/${kundaliId}`);
    return res.data;
  },
);

// ─── NEW: saveBirthDetails ────────────────────────────────────────────────────

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

      // Persist birth details so next launch skips onboarding
      await AsyncStorage.setItem(
        STORAGE_KEYS.BIRTH_DETAILS,
        JSON.stringify(details),
      );

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

// ─── NEW: clearBirthDetails (for "change details" flow) ──────────────────────

export const clearPersistedData = createAsyncThunk(
  'kundali/clearPersistedData',
  async () => {
    await Promise.all([
      AsyncStorage.removeItem(STORAGE_KEYS.BIRTH_DETAILS),
      AsyncStorage.removeItem(STORAGE_KEYS.CURRENT_KUNDALI),
    ]);
  },
);

// ─── Slice ────────────────────────────────────────────────────────────────────

const kundaliSlice = createSlice({
  name: 'kundali',
  initialState,
  reducers: {
    // EXISTING
    setBirthDetails(state, action: PayloadAction<BirthDetails>) {
      state.birthDetails = action.payload;
    },
    // NEW — rehydrate kundali from AsyncStorage on app launch
    setCurrentKundali(state, action: PayloadAction<any>) {
      state.currentKundali = action.payload;
    },
    // NEW — update FCM token when Firebase rotates it
    updateFCMToken(state, action: PayloadAction<string>) {
      state.fcmToken = action.payload;
    },
    // NEW — called when user wants to change birth details
    resetKundali(state) {
      state.birthDetails = null;
      state.currentKundali = null;
      state.userRecordId = null;
    },
  },
  extraReducers: builder => {
    builder
      // generateKundali
      .addCase(generateKundali.pending, state => {
        state.loading = true;
      })
      .addCase(generateKundali.fulfilled, (state, action) => {
        state.loading = false;
        state.currentKundali = action.payload;
        // Persist kundali data so it survives app restart
        AsyncStorage.setItem(
          STORAGE_KEYS.CURRENT_KUNDALI,
          JSON.stringify(action.payload),
        ).catch(() => {});
      })

      // fetchKundaliList
      .addCase(fetchKundaliList.fulfilled, (state, action) => {
        state.kundaliList = action.payload;
      })

      // fetchKundaliOverview
      .addCase(fetchKundaliOverview.fulfilled, (state, action) => {
        state.currentKundali = action.payload;
      })

      // saveBirthDetails
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
      })

      // clearPersistedData
      .addCase(clearPersistedData.fulfilled, state => {
        state.birthDetails = null;
        state.currentKundali = null;
        state.userRecordId = null;
      });
  },
});

export const {
  setBirthDetails,
  setCurrentKundali,
  updateFCMToken,
  resetKundali,
} = kundaliSlice.actions;

export default kundaliSlice.reducer;
