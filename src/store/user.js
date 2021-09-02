import UserService from "../services/userService";
import { useAuth } from "./auth";

export const useUser = () => {
  const getUser = async () => {
    const { token } = useAuth();
    return UserService.getUser(token);
  }

  const register = async (name, cpf, password) => {
    return UserService.register(name, cpf, password);
  }

  return { getUser, register };
}