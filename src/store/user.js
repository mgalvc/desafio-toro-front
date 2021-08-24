import UserService from "../services/userService";
import { useAuth } from "./auth";

export const useUser = () => {
  const { token } = useAuth();

  const getUser = async () => {
    return UserService.getUser(token);
  }

  return { getUser };
}