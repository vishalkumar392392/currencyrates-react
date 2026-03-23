import axios from 'axios';

const BASE_URL = import.meta.env.REACT_API_BASE_URL || 'http://localhost:8000';

const userService = {
  getCurrencyRates: async () => {
    const response = await axios.get(`${BASE_URL}/api/currency-rates`);
    return response.data;
  },
};

export default userService;
