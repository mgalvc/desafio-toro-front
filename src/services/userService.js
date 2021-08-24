import axios from "axios";

export default class UserService {
  static async getUser(token) {
    try {
      const { data } = await axios.get('http://localhost:3000/user', {
        headers: { authorization: `Bearer ${token}` }
      });

      return data;
    } catch(err) {
      return { error: err.response?.data?.message }
    }
  }
}