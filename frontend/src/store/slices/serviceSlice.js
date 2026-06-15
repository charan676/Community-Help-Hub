import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { emergency, hospitals, schemes, education } from '../../services/api';

// Async thunks for fetching datasets
export const fetchEmergencies = createAsyncThunk('services/fetchEmergencies', async (districtCode, { rejectWithValue }) => {
  try {
    const res = await emergency.getAll(districtCode);
    return res.data.services;
  } catch (err) {
    return rejectWithValue(err.message);
  }
});

export const fetchHospitals = createAsyncThunk('services/fetchHospitals', async (filters, { rejectWithValue }) => {
  try {
    const res = await hospitals.getAll(filters);
    return res.data.hospitals;
  } catch (err) {
    return rejectWithValue(err.message);
  }
});

export const fetchSchemes = createAsyncThunk('services/fetchSchemes', async (filters, { rejectWithValue }) => {
  try {
    const res = await schemes.getAll(filters);
    return res.data.schemes;
  } catch (err) {
    return rejectWithValue(err.message);
  }
});

export const fetchEducation = createAsyncThunk('services/fetchEducation', async (category, { rejectWithValue }) => {
  try {
    const res = await education.getAll(category);
    return res.data.resources;
  } catch (err) {
    return rejectWithValue(err.message);
  }
});

const initialState = {
  emergencies: [],
  hospitals: [],
  schemes: [],
  education: [],
  loading: false,
  error: null
};

const serviceSlice = createSlice({
  name: 'services',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Emergencies
      .addCase(fetchEmergencies.pending, (state) => { state.loading = true; })
      .addCase(fetchEmergencies.fulfilled, (state, action) => {
        state.loading = false;
        state.emergencies = action.payload;
      })
      .addCase(fetchEmergencies.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Hospitals
      .addCase(fetchHospitals.pending, (state) => { state.loading = true; })
      .addCase(fetchHospitals.fulfilled, (state, action) => {
        state.loading = false;
        state.hospitals = action.payload;
      })
      .addCase(fetchHospitals.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Schemes
      .addCase(fetchSchemes.pending, (state) => { state.loading = true; })
      .addCase(fetchSchemes.fulfilled, (state, action) => {
        state.loading = false;
        state.schemes = action.payload;
      })
      .addCase(fetchSchemes.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Education
      .addCase(fetchEducation.pending, (state) => { state.loading = true; })
      .addCase(fetchEducation.fulfilled, (state, action) => {
        state.loading = false;
        state.education = action.payload;
      })
      .addCase(fetchEducation.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  }
});

export default serviceSlice.reducer;
