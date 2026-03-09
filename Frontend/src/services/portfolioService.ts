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
    } catch (error: any) {
      console.error("Error in createPortfolio:", error);
   
      throw error;
    }
  },

  getAllPortfolios: async (page: number = 1, limit: number = 10) => {
    try {
      const response = await axios.get(API_ENDPOINTS.PORTFOLIO.GET_ALL, {
        params: { page, limit }
      });
      return response.data;
    } catch (error: any) {
      console.error("Error in getAllPortfolios:", error);
      throw error;
    }
  }

};
