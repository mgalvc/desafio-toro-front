import { useAuth } from "./auth"
import WalletService from '../services/walletService'

export const useWallet = () => {
  const { token } = useAuth();

  const getWallet = async () => {
    return WalletService.getUserWallet(token);
  }

  const sendOrder = async (symbol, amount) => {
    return WalletService.sendOrder(symbol, parseInt(amount), token);
  }

  return { getWallet, sendOrder };
}