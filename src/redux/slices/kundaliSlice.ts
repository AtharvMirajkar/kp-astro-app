import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import axiosInstance from '../../api/axiosInstance';
import axios from 'axios';

// ─── New imports for FCM ──────────────────────────────────────────────────────
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
  // ── NEW ──
  userRecordId: string | null; // MongoDB _id from POST /api/users
  deviceId: string | null; // stable hardware device ID
  fcmToken: string | null; // Firebase Cloud Messaging token
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
  // ── NEW ──
  userRecordId: null,
  deviceId: null,
  fcmToken: null,
};

// ─── EXISTING: generateKundali ────────────────────────────────────────────────
// Untouched — calls external engine directly with plain axios

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
    const payload = {
      date: birthDetails.dob,
      time: birthDetails.tob,
      latitude: Number(birthDetails.latitude),
      longitude: Number(birthDetails.longitude),
      timezone: 'Asia/Kolkata',
    };

    console.log(payload, '<------- Payload');
    const res = await axios.post(
      'https://kp-astro-engine.onrender.com/generate-chart',
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
// Resolves deviceId + FCM token, then saves user data to POST /api/users.
// Call this from BirthDetailsScreen BEFORE navigating to KundaliLoadingScreen.
// generateKundali is still called from KundaliLoadingScreen exactly as before.

export const saveBirthDetails = createAsyncThunk(
  'kundali/saveBirthDetails',
  async (details: BirthDetails, { rejectWithValue }) => {
    try {
      // 1. Request notification permission (no-op if already granted)
      await requestNotificationPermission();

      // 2. Get deviceId + FCM token in parallel
      const [deviceId, fcmToken] = await Promise.all([
        getOrCreateDeviceId(),
        getFCMToken(),
      ]);

      // 3. Save to your backend POST /api/users
      // Backend schema: { name, gender, deviceId, dateOfBirth, timeOfBirth, placeOfBirth }
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
    // EXISTING — untouched
    setBirthDetails(state, action: PayloadAction<BirthDetails>) {
      state.birthDetails = action.payload;
    },
    // NEW — called by useNotifications when Firebase rotates the token
    updateFCMToken(state, action: PayloadAction<string>) {
      state.fcmToken = action.payload;
    },
  },
  extraReducers: builder => {
    builder
      // ── EXISTING: generateKundali ──────────────────────────────────────────
      .addCase(generateKundali.pending, state => {
        state.loading = true;
      })
      .addCase(generateKundali.fulfilled, (state, action) => {
        state.loading = false;
        state.currentKundali = action.payload;
      })

      // ── EXISTING: fetchKundaliList ─────────────────────────────────────────
      .addCase(fetchKundaliList.fulfilled, (state, action) => {
        state.kundaliList = action.payload;
      })

      // ── EXISTING: fetchKundaliOverview ─────────────────────────────────────
      .addCase(fetchKundaliOverview.fulfilled, (state, action) => {
        state.currentKundali = action.payload;
      })

      // ── NEW: saveBirthDetails ──────────────────────────────────────────────
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
        // Don't block the user — they can still generate kundali
        // deviceId/fcmToken just won't be stored on backend this session
        state.loading = false;
      });
  },
});

export const { setBirthDetails, updateFCMToken } = kundaliSlice.actions;
export default kundaliSlice.reducer;
