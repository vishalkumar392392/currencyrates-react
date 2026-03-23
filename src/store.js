import { configureStore } from '@reduxjs/toolkit';
import currencyRatesReducer from './redux/CurrencyRates/currencyRateSlice';

const store = configureStore({
  reducer: {
    currencyRates: currencyRatesReducer,
  },
  devTools: import.meta.env.REACT_ENABLE_DEVTOOLS === 'true',
});

export default store;
