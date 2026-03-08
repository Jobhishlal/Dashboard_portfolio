import axios from "@/lib/axios";
import { API_ENDPOINTS } from "@/constants/apiEndpoints";

export interface PortfolioData {
  symbol: string;
  purchasePrice: number;
  quantity: number;
  sector?: string;
  exchange: string;
}

export const portfolioService = {

  createPortfolio: async (data: PortfolioData) => {
    try {
      const response = await axios.post(API_ENDPOINTS.PORTFOLIO.CREATE, data);
      return response.data;
    } catch (error) {
      console.error("Error in createPortfolio:", error);
      throw error;
    }
  },


};
