import puppeteer, { Page, Browser } from "puppeteer-core";
import chromium from "@sparticuz/chromium";

export class StockMarketService {

  static async getStockData(pageOrTicker: Page | string, tickerOrExchange?: string, exchange: string = "NSE") {
    let page: Page;
    let browser: Browser | null = null;
    let ticker: string;
    let currentExchange: string = exchange;

    if (typeof pageOrTicker === 'string') {
      ticker = pageOrTicker;
      currentExchange = tickerOrExchange || "NSE";

      const isWindows = process.platform === 'win32';
      const launchOptions: any = {
        args: isWindows ? [] : chromium.args,
        headless: true,
      };

      if (!isWindows) {
        launchOptions.executablePath = await chromium.executablePath();
      } else {
        // Common paths for Chrome or Edge on Windows
        const paths = [
          'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
          'C:\\Program Files (x86)\\Google\\Chrome\\Application\\chrome.exe',
          'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe',
          'C:\\Program Files\\Microsoft\\Edge\\Application\\msedge.exe'
        ];
        const fs = require('fs');
        launchOptions.executablePath = paths.find(p => fs.existsSync(p));
      }

      browser = await puppeteer.launch(launchOptions);
      page = await browser.newPage();
    } else {
      page = pageOrTicker;
      ticker = tickerOrExchange!;
    }

    try {
      const url = `https://www.google.com/finance/quote/${ticker}:${currentExchange}`;
      console.log(`Scraping ${ticker}...`);

      await page.goto(url, { waitUntil: "domcontentloaded", timeout: 30000 });

      const text = await page.evaluate(() => document.body.innerText);

      const price = await this.extractPrice(page);
      const peRatio = this.parsePERatio(text);
      const eps = this.parseEPS(text, price, peRatio);

      if (browser) await browser.close();

      return { price, peRatio, eps };

    } catch (error) {
      if (browser) await browser.close();
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
