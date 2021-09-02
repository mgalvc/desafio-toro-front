export const useAuth = () => {  
  const setToken = (token) => {
    localStorage.setItem('accessToken', token);
  }

  const getToken = () => {
    const token = localStorage.getItem('accessToken');
    
    return token;
  }

  const logout = () => {
    setToken(null);
  }

  return { token: getToken(), setToken, logout };
}