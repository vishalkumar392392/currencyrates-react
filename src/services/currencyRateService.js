// TODO: Remove mock import and uncomment real API call once backend is ready
import mockCurrencyRates from '../mocks/currencyRates';
// import axios from 'axios';
// const BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080';

const userService = {
  getCurrencyRates: async () => {
    return mockCurrencyRates;

    // const response = await axios.get(`${BASE_URL}/api/currency-rates`);
    // return response.data;
  },
};

export default userService;
