import puppeteer, { Page } from "puppeteer-core";
import chromium from "@sparticuz/chromium";

export class StockMarketService {

  static async getStockData(ticker: string = "TCS", exchange: string = "NSE") {
    let browser;
    try {
      const isWindows = process.platform === 'win32';
      const launchOptions: any = {
        args: isWindows ? [] : chromium.args,
        headless: true,
      };

      if (!isWindows) {
        launchOptions.executablePath = await chromium.executablePath();
      } else {
        const paths = [
          'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
          'C:\\Program Files (x86)\\Google\\Chrome\\Application\\chrome.exe',
          'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe',
          'C:\\Program Files\\Microsoft\\Edge\\Application\\msedge.exe'
        ];
        const fs = require('fs');
        launchOptions.executablePath = paths.find((p: string) => fs.existsSync(p));
      }

      browser = await puppeteer.launch(launchOptions);
      const page = await browser.newPage();

      await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36');

      const url = `https://www.google.com/finance/quote/${ticker}:${exchange}`;
      console.log(`Navigating to ${url}...`);
      await page.goto(url, { waitUntil: "domcontentloaded" });

      const text = await page.evaluate(() => document.body.innerText);

      const price = await this.extractPrice(page);
      const peRatio = this.parsePERatio(text);
      const eps = this.parseEPS(text, price, peRatio);

      return { price, peRatio, eps };
    } catch (error) {
      console.error("Scraping failed:", error);
      return null;
    } finally {
      if (browser) await browser.close();
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

    try {
      const parts = text.split(/P\/E RATIO/i);
      if (parts.length > 1) {

        const block = parts[1].split(/DIVIDEND YIELD/i)[0];
        const matches = block.match(/[\d,.]+/g);
        if (matches) {
          return parseFloat(matches[matches.length - 1].replace(/,/g, ""));
        }
      }
    } catch (e) { }
    return null;
  }

  static parseEPS(text: string, price: number | null, peRatio: number | null) {

    const match = text.match(/\nEPS\n([\d,.]+)/i) || text.match(/EPS\s+₹?([\d,.]+)/i);
    if (match) {
      return parseFloat(match[1].replace(/,/g, ""));
    }

    if (price && peRatio && peRatio > 0) {
      return parseFloat((price / peRatio).toFixed(2));
    }

    return null;
  }
}


StockMarketService.getStockData().then(data => {
  console.log("Final Scraped Data:", data);
}); 