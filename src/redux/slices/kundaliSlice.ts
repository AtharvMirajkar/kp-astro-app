import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axiosInstance from '../../api/axiosInstance';
import axios from 'axios';

interface KundaliState {
  currentKundali: any | null;
  kundaliList: any[];
  birthDetails: BirthDetails | null;
  loading: boolean;
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

const initialState: KundaliState = {
  currentKundali: null,
  kundaliList: [],
  birthDetails: null,
  loading: false,
};

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
      timezone: 'Asia/Kolkata', // required by API
    };

    console.log(payload, '<------- Payload');
    const res = await axios.post(
      'https://kp-astro-engine.onrender.com/generate-chart',
      payload,
    );
    return res.data;
  },
);

export const fetchKundaliList = createAsyncThunk('kundali/list', async () => {
  const res = await axiosInstance.get('/kundali');
  return res.data;
});

export const fetchKundaliOverview = createAsyncThunk(
  'kundali/overview',
  async (kundaliId: string) => {
    const res = await axiosInstance.get(`/kundali/${kundaliId}`);
    return res.data;
  },
);

const kundaliSlice = createSlice({
  name: 'kundali',
  initialState,
  reducers: {
    setBirthDetails(state, action) {
      state.birthDetails = action.payload;
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
      });
  },
});

export const { setBirthDetails } = kundaliSlice.actions;
export default kundaliSlice.reducer;
