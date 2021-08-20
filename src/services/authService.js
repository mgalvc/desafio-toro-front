import axios from 'axios';

export default class AuthService {
  static async login(email, password) {
    try {
      const { data } = await axios.post('http://localhost:3000/auth/login', {
        email, password
      })
      return { data }
    } catch(err) {
      return { error: err.response.data.message }
    }
  }
}