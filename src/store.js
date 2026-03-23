import { configureStore } from '@reduxjs/toolkit';
import currencyRatesReducer from './redux/CurrencyRates/currencyRateSlice';

const store = configureStore({
  reducer: {
    currencyRates: currencyRatesReducer,
  },
});

export default store;
