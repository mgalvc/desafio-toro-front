import StockService from "../services/stockService"
import { useAuth } from "./auth";

export const useStock = () => {
  const { token } = useAuth();

  const getTrends = () => {
    return StockService.getTrends(token);
  }

  return { getTrends }
}