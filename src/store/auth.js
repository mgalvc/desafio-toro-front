import { useRouter } from "vue-router";

export const useAuth = () => {
  const { push } = useRouter();
  
  const setToken = (token) => {
    localStorage.setItem('accessToken', token);
  }

  const getToken = () => {
    const token = localStorage.getItem('accessToken');
    
    if(!token) {
      push('/auth');
    }
    
    return token;
  }

  const logout = () => {
    setToken(null);
    push('/auth');
  }

  return { token: getToken(), setToken, logout };
}