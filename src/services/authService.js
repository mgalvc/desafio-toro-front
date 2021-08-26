import axios from 'axios';

export default class AuthService {
  static async login(cpf, password) {
    try {
      const { data } = await axios.post(`${process.env.VUE_APP_API_BASE_URL}/auth/login`, {
        cpf, password
      })
      return { data }
    } catch(err) {
      return { error: err.response.data.message }
    }
  }
}