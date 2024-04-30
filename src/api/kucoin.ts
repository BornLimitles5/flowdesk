import axios from 'axios';

const API_BASE_URL = 'https://api.kucoin.com';

export default async function fetchTradeHistory(symbol: string) {
    console.log(symbol,"Trade History");
    
    try {
        const response = await axios.get(`${API_BASE_URL}/api/v1/market/histories?symbol=${symbol}`);

        return response.data;
    } catch (error) {
        console.error("Error fetching trade history:", error);
        throw error; 
    }
}
