import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import currencyRateService from '../../services/currencyRateService';

export const fetchCurrencyRates = createAsyncThunk(
  'currencyRates/fetchCurrencyRates',
  async (_, { rejectWithValue }) => {
    try {
      return await currencyRateService.getCurrencyRates();
    } catch (error) {
      return rejectWithValue(error.response?.data ?? error.message);
    }
  }
);

const currencyRatesSlice = createSlice({
  name: 'currencyRates',
  initialState: {
    currencyRates: [],
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchCurrencyRates.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCurrencyRates.fulfilled, (state, action) => {
        state.loading = false;
        state.currencyRates = action.payload;
      })
      .addCase(fetchCurrencyRates.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default currencyRatesSlice.reducer;
