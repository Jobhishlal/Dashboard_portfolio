import axios from "axios";

export class YahooFinanceService {

  static async getCMP(symbol: string) {

    try {

      const url = `https://query1.finance.yahoo.com/v8/finance/chart/${symbol}.NS`;

      const response = await axios.get(url);

      const cmp =
        response.data?.chart?.result?.[0]?.meta?.regularMarketPrice;

      return cmp;

    } catch (error) {

      console.error(`Yahoo error for ${symbol}`, error);

      return null;

    }

  }

}


async function run() {

  const stocks = ["TCS","INFY","RELIANCE","HDFCBANK"];

  for (const stock of stocks) {

    const cmp = await YahooFinanceService.getCMP(stock);

    console.log(stock, "CMP:", cmp);

  }

}

run();