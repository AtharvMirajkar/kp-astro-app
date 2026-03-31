import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import i18n from '../../i18n';

// ─── Types ────────────────────────────────────────────────────────────────────

export interface PartnerInput {
  name: string;
  gender: 'male' | 'female';
  dob: string; // "YYYY-MM-DD"
  tob: string; // "HH:mm"
  latitude: string;
  longitude: string;
}

interface KootaItem {
  koot: string;
  max_points: number;
  scored: number;
  compatible: boolean;
  [key: string]: any; // boy_varna, girl_varna, etc. — API-language values
}

interface MangalDosha {
  mars_house: number;
  has_mangal_dosha: boolean;
  description: string;
}

export interface GunMilanResult {
  boy: {
    nakshatra: string;
    nakshatra_lord: string;
    rashi: string;
    rashi_lord: string;
  };
  girl: {
    nakshatra: string;
    nakshatra_lord: string;
    rashi: string;
    rashi_lord: string;
  };
  kootas: KootaItem[];
  total_scored: number;
  max_points: number;
  compatibility: {
    grade: string;
    percentage: number;
    recommendation: string;
  };
  mangal_dosha: {
    boy: MangalDosha;
    girl: MangalDosha;
    cancellation_note: string;
  };
  // Store partner names so CompatibilityReportScreen can display them
  _boyName: string;
  _girlName: string;
}

interface MatchingState {
  result: GunMilanResult | null;
  loading: boolean;
  error: string | null;
}

const initialState: MatchingState = {
  result: null,
  loading: false,
  error: null,
};

// ─── Thunk ────────────────────────────────────────────────────────────────────

export const calculateGunMilan = createAsyncThunk(
  'matching/calculateGunMilan',
  async (
    { partner1, partner2 }: { partner1: PartnerInput; partner2: PartnerInput },
    { rejectWithValue },
  ) => {
    try {
      const lang = i18n.language?.split('-')[0] ?? 'en';
      const language = ['en', 'hi', 'mr'].includes(lang) ? lang : 'en';

      // API expects boy/girl based on gender
      const boy = partner1.gender === 'male' ? partner1 : partner2;
      const girl = partner1.gender === 'female' ? partner1 : partner2;

      const payload = {
        boy: {
          date: boy.dob,
          time: boy.tob,
          latitude: Number(boy.latitude),
          longitude: Number(boy.longitude),
          timezone: 'Asia/Kolkata',
        },
        girl: {
          date: girl.dob,
          time: girl.tob,
          latitude: Number(girl.latitude),
          longitude: Number(girl.longitude),
          timezone: 'Asia/Kolkata',
        },
      };

      const res = await axios.post(
        `https://kp-astro-engine.onrender.com/gun-milan?language=${language}`,
        payload,
      );

      // Attach names for display on report screen
      return {
        ...res.data,
        _boyName: boy.name,
        _girlName: girl.name,
      } as GunMilanResult;
    } catch (error: any) {
      return rejectWithValue(
        error?.response?.data?.message ?? 'Failed to calculate compatibility',
      );
    }
  },
);

// ─── Slice ────────────────────────────────────────────────────────────────────

const matchingSlice = createSlice({
  name: 'matching',
  initialState,
  reducers: {
    clearMatchingResult(state) {
      state.result = null;
      state.error = null;
    },
  },
  extraReducers: builder => {
    builder
      .addCase(calculateGunMilan.pending, state => {
        state.loading = true;
        state.error = null;
      })
      .addCase(calculateGunMilan.fulfilled, (state, action) => {
        state.loading = false;
        state.result = action.payload;
      })
      .addCase(calculateGunMilan.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const { clearMatchingResult } = matchingSlice.actions;
export default matchingSlice.reducer;
