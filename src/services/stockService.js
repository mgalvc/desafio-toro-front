import axios from "axios";

export default class StockService {
  static async getTrends(token) {
    try {
      const { data } = await axios.get(`${process.env.VUE_APP_API_BASE_URL}/stocks/trends`, {
        headers: { authorization: `Bearer ${token}` }
      });

      return data;
    } catch(err) {
      return { error: err.response?.data?.message }
    }
  }
}