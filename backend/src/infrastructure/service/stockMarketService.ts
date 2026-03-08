import puppeteer, { Page } from "puppeteer";
import { YahooFinanceService } from "./yahooFinanceService";

export class StockMarketService {

  static async getStockData(page: Page, ticker: string, exchange: string = "NSE") {

    try {

      const url = `https://www.google.com/finance/quote/${ticker}:${exchange}`;
      console.log(`Scraping ${ticker}...`);

      await page.goto(url, { waitUntil: "networkidle2" });

      const text = await page.evaluate(() => document.body.innerText);

      const price = await this.extractPrice(page);
      const peRatio = this.parsePERatio(text);
      const eps = this.parseEPS(text, price, peRatio);

      return { price, peRatio, eps };

    } catch (error) {

      console.error(`Error scraping ${ticker}`, error);
      return null;

    }
  }

  static async extractPrice(page: Page) {

    return await page.evaluate(() => {

      const el = document.querySelector('.YMlS1d, .fxKb9e, [data-last-price]');
      const text = el?.textContent?.replace(/[₹,]/g, "") || "";

      return text ? parseFloat(text) : null;

    });

  }

  static parsePERatio(text: string) {

    if (!text.toUpperCase().includes("P/E RATIO")) return null;

    const parts = text.split(/P\/E RATIO/i);

    if (parts.length > 1) {

      const block = parts[1].split(/DIVIDEND YIELD/i)[0];
      const matches = block.match(/[\d,.]+/g);

      if (matches) {
        return parseFloat(matches[matches.length - 1].replace(/,/g, ""));
      }

    }

    return null;

  }

  static parseEPS(text: string, price: number | null, peRatio: number | null) {

    const match =
      text.match(/\nEPS\n([\d,.]+)/i) ||
      text.match(/EPS\s+₹?([\d,.]+)/i);

    if (match) {
      return parseFloat(match[1].replace(/,/g, ""));
    }

    if (price && peRatio && peRatio > 0) {
      return parseFloat((price / peRatio).toFixed(2));
    }

    return null;

  }

}

async function run() {

  const stocks = ["TCS", "INFY", "RELIANCE", "HDFCBANK"];

  const browser = await puppeteer.launch({ headless: true });

  const page = await browser.newPage();

  await page.setUserAgent(
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/122 Safari/537.36"
  );

  for (const stock of stocks) {

    const fundamentals =
      await StockMarketService.getStockData(page, stock);

    const cmp =
      await YahooFinanceService.getCMP(stock);

    console.log(stock, {
      cmp,
      peRatio: fundamentals?.peRatio,
      eps: fundamentals?.eps
    });

  }

  await browser.close();

}

run();