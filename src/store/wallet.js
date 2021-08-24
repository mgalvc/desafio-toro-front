import { useAuth } from "./auth"
import WalletService from '../services/walletService'

export const useWallet = () => {
  const { token } = useAuth();

  const getWallet = async () => {
    return WalletService.getUserWallet(token);
  }

  return { getWallet };
}