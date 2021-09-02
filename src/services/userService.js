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

  static async register(name, cpf, password) {
    try {
      const { data } = await axios.post(`${process.env.VUE_APP_API_BASE_URL}/user`, {
        name, cpf, password
      });

      return data;
    } catch(err) {
      return { error: err.response?.data?.message }
    }
  }
}