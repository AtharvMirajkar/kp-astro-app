/**
 * src/redux/slices/healthPredictionSlice.ts
 *
 * Fetches health astrology reading from:
 *   GET /api/health-astrology/reading?rashi=aquarius&lagna=scorpio&language=en
 *
 * rashi  → moon sign (e.g. "aquarius")
 * lagna  → ascendant sign (e.g. "scorpio")
 * language → i18n language code ("en" | "hi" | "mr")
 */

import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import axios from 'axios';
import i18n from '../../i18n';

// ─── Types ────────────────────────────────────────────────────────────────────

export interface HealthAstrologyReading {
  success: boolean;
  found: boolean;
  rashi: string;
  lagna: string;
  language: string;
  /** Present only when found === true */
  code?: string;
  content?: string;
  category?: string;
  /** Present only when found === false */
  message?: string;
}

interface HealthPredictionState {
  reading: HealthAstrologyReading | null;
  loading: boolean;
  error: string | null;
  /** Cache key: "<rashi>_<lagna>_<language>" — avoids redundant API calls */
  lastFetchKey: string | null;
}

const initialState: HealthPredictionState = {
  reading: null,
  loading: false,
  error: null,
  lastFetchKey: null,
};

// ─── Helper ───────────────────────────────────────────────────────────────────

type SupportedLanguage = 'en' | 'hi' | 'mr';
const SUPPORTED_LANGUAGES: SupportedLanguage[] = ['en', 'hi', 'mr'];

function getApiLanguage(): SupportedLanguage {
  const lang = i18n.language?.split('-')[0];
  return SUPPORTED_LANGUAGES.includes(lang as SupportedLanguage)
    ? (lang as SupportedLanguage)
    : 'en';
}

/** Normalize a sign name to lowercase, no spaces.
 *  e.g. "Aquarius" → "aquarius", "Aries" → "aries"
 */
function normalizeSign(sign: string): string {
  return sign.toLowerCase().trim().replace(/\s+/g, '_');
}

// ─── Thunk ────────────────────────────────────────────────────────────────────

interface FetchHealthReadingParams {
  moonSign: string; // raw sign name from kundali (e.g. "Aquarius")
  ascendantSign: string; // raw ascendant name (e.g. "Scorpio")
  forceRefresh?: boolean;
}

export const fetchHealthReading = createAsyncThunk(
  'healthPrediction/fetchReading',
  async (
    { moonSign, ascendantSign }: FetchHealthReadingParams,
    { rejectWithValue },
  ) => {
    try {
      const language = getApiLanguage();
      const rashi = normalizeSign(moonSign);
      const lagna = normalizeSign(ascendantSign);

      const response = await axios.get(
        'https://kp-astro-backend.onrender.com/api/health-astrology/reading',
        {
          params: { rashi, lagna, language },
          timeout: 15000,
        },
      );

      return {
        data: response.data as HealthAstrologyReading,
        fetchKey: `${rashi}_${lagna}_${language}`,
      };
    } catch (error: any) {
      return rejectWithValue(
        error?.response?.data?.message ?? 'Failed to fetch health reading',
      );
    }
  },
);

// ─── Slice ────────────────────────────────────────────────────────────────────

const healthPredictionSlice = createSlice({
  name: 'healthPrediction',
  initialState,
  reducers: {
    clearHealthReading(state) {
      state.reading = null;
      state.error = null;
      state.lastFetchKey = null;
    },
  },
  extraReducers: builder => {
    builder
      .addCase(fetchHealthReading.pending, state => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchHealthReading.fulfilled, (state, action) => {
        state.loading = false;
        state.reading = action.payload.data;
        state.lastFetchKey = action.payload.fetchKey;
      })
      .addCase(fetchHealthReading.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const { clearHealthReading } = healthPredictionSlice.actions;
export default healthPredictionSlice.reducer;
