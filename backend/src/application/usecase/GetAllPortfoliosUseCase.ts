import { IPortfolioDatabaseinterface } from "../interface/RepositoryInterface/IPortfolioInterface";
import { IGetAllPortfoliosUseCase } from "../interface/UsecaseInterface/IGetAllPortfoliosUseCase";
import { StockMarketService } from "../../infrastructure/service/stockMarketService";
import { YahooFinanceService } from "../../infrastructure/service/yahooFinanceService";
import { IPortfolioDashboardResponseDTO, IPaginatedPortfolioResponseDTO } from "../dto/portfolio.dto";
import puppeteer from "puppeteer-core";
import chromium from "@sparticuz/chromium";
import { ISendNotificationUseCase } from "./SendNotificationUseCase";

export class GetAllPortfoliosUseCase implements IGetAllPortfoliosUseCase {
    private previousCmpMap: Record<string, number> = {};
    private static cache: Record<string, {
        cmp: number;
        peRatio: number | null;
        eps: number | null;
        lastUpdated: number;
    }> = {};
    private static readonly CACHE_TTL_MS = 60000; // 60 seconds cache

    constructor(
        private readonly _portfolioRepo: IPortfolioDatabaseinterface,
        private readonly _sendNotificationUseCase?: ISendNotificationUseCase
    ) { }

    async execute(page: number = 1, limit: number = 10): Promise<IPaginatedPortfolioResponseDTO> {

        const total = await this._portfolioRepo.count();
        const portfolios = await this._portfolioRepo.findAll(page, limit);

        if (!portfolios || portfolios.length === 0) {
            return {
                data: [],
                total,
                page,
                limit,
                totalPages: Math.ceil(total / limit)
            };
        }


        const allPortfolios = await this._portfolioRepo.findAll();
        const totalInvestment = allPortfolios.reduce((sum, p) => sum + p.getInvestment(), 0);

        const liveDataMap: Record<string, { cmp: number; peRatio: number | null; eps: number | null; lastUpdated: number }> = {};


        const now = Date.now();
        const stocksToScrape = portfolios.filter(p => {
            const cached = GetAllPortfoliosUseCase.cache[p.symbol];
            if (cached && (now - cached.lastUpdated) < GetAllPortfoliosUseCase.CACHE_TTL_MS) {
                liveDataMap[p.symbol] = cached;
                return false;
            }
            return true;
        });

        if (stocksToScrape.length > 0) {
            let browser: any;
            try {
                const isWindows = process.platform === 'win32';
                const launchOptions: any = {
                    args: isWindows ? [] : [...chromium.args, "--no-sandbox", "--disable-setuid-sandbox", "--disable-dev-shm-usage"],
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
                    launchOptions.executablePath = paths.find(p => fs.existsSync(p));
                }

                browser = await puppeteer.launch(launchOptions);
                const page = await browser.newPage();

                for (const p of stocksToScrape) {
                    try {
                        if (!liveDataMap[p.symbol]) {
                            const cmp = await YahooFinanceService.getCMP(p.symbol);
                            const fundamentals = await StockMarketService.getStockData(page, p.symbol, p.exchange);

                            const newData = {
                                cmp: cmp || fundamentals?.price || p.purchasePrice,
                                peRatio: fundamentals?.peRatio || null,
                                eps: fundamentals?.eps || null,
                                lastUpdated: now
                            };

                            liveDataMap[p.symbol] = newData;
                            GetAllPortfoliosUseCase.cache[p.symbol] = newData;
                        }
                    } catch (scrapeError) {
                        console.error(`Error scraping ${p.symbol}:`, scrapeError);
                        // Provide fallback for this specific stock so loop continues
                        liveDataMap[p.symbol] = liveDataMap[p.symbol] || {
                            cmp: p.purchasePrice,
                            peRatio: null,
                            eps: null,
                            lastUpdated: now
                        };
                    }
                }
            } catch (error) {
                console.error("Critical error in live data scraping:", error);
                // Fallback: Ensure all stocks have SOME data so the map operation later doesn't fail
                for (const p of stocksToScrape) {
                    if (!liveDataMap[p.symbol]) {
                        liveDataMap[p.symbol] = {
                            cmp: p.purchasePrice,
                            peRatio: null,
                            eps: null,
                            lastUpdated: now
                        };
                    }
                }
            } finally {
                if (browser) await browser.close();
            }
        }

        const responseData: IPortfolioDashboardResponseDTO[] = portfolios.map(p => {
            const liveData = liveDataMap[p.symbol];
            const cmp = liveData?.cmp || p.purchasePrice;

            return {
                id: p.id,
                symbol: p.symbol,
                name: p.symbol,
                purchasePrice: p.purchasePrice,
                quantity: p.quantity,
                investment: p.getInvestment(),
                portfolioPercentage: p.getPortfolioPercentage(totalInvestment),
                exchange: p.exchange,
                cmp: cmp,
                presentValue: p.getPresentValue(cmp),
                gainLoss: p.getGainLoss(cmp),
                peRatio: liveData?.peRatio || 0,
                eps: liveData?.eps || 0,
                sector: p.sector
            };
        });

        if (this._sendNotificationUseCase) {
            for (const p of responseData) {
                const prevCmp = this.previousCmpMap[p.symbol];
                if (prevCmp && p.cmp > prevCmp) {
                    const diff = p.cmp - prevCmp;
                    const profitInc = diff * p.quantity;
                    void this._sendNotificationUseCase.execute(
                        `${p.symbol} CMP increased to ₹${p.cmp}! Profit increased by ₹${profitInc.toFixed(2)}.`,
                        'success'
                    );
                } else if (prevCmp && p.cmp < prevCmp) {

                }

                this.previousCmpMap[p.symbol] = p.cmp;
            }
        }

        return {
            data: responseData,
            total,
            page,
            limit,
            totalPages: Math.ceil(total / limit)
        };
    }
}
