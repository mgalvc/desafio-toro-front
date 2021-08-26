import axios from "axios";

export default class UserService {
  static async getUser(token) {
    try {
      const { data } = await axios.get(`${process.env.VUE_APP_API_BASE_URL}/user`, {
        headers: { authorization: `Bearer ${token}` }
      });

      return data;
    } catch(err) {
      return { error: err.response?.data?.message }
    }
  }
}