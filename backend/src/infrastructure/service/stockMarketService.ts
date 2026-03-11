import axios from "axios";
import * as cheerio from "cheerio";

export class StockMarketService {

  static async getStockData(symbol: string) {
    try {
   
      const cleanSymbol = symbol.replace(".NS", "").replace(".BO", "");
      const url = `https://www.screener.in/company/${cleanSymbol}/`;

      const { data } = await axios.get(url, {
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36'
        },
        timeout: 10000
      });

      const $ = cheerio.load(data);

      let peRatio: number | null = null;
      let price: number | null = null;
      let eps: number | null = null;

      // Extract Price and PE from the "Key Stats" section
      $('.company-info li').each((i, el) => {
        const label = $(el).find('.name').text().trim();
        const valueText = $(el).find('.number').text().trim().replace(/,/g, '');
        const value = parseFloat(valueText);

        if (label.includes('Current Price')) {
          price = value;
        } else if (label.includes('Stock P/E')) {
          peRatio = value;
        }
      });

      // Calculate EPS (Price / PE) if both exist
      if (price && peRatio && peRatio > 0) {
        eps = parseFloat((price / peRatio).toFixed(2));
      }

      console.log(`Successfully fetched data for ${cleanSymbol}: Price=${price}, PE=${peRatio}, EPS=${eps}`);

      return {
        price,
        peRatio,
        eps
      };

    } catch (error: any) {
      console.error(`Error fetching data for ${symbol} from Screener:`, error.message);
      return null;
    }
  }

  
  static async getStockDataPuppeteer(pageOrTicker: any, tickerOrExchange?: string, exchange: string = "NSE") {
    const ticker = typeof pageOrTicker === 'string' ? pageOrTicker : tickerOrExchange!;
    return this.getStockData(ticker);
  }
}
