import { IPortfolioDatabaseinterface } from "../interface/RepositoryInterface/IPortfolioInterface";
import { IGetAllPortfoliosUseCase } from "../interface/UsecaseInterface/IGetAllPortfoliosUseCase";
import { StockMarketService } from "../../infrastructure/service/stockMarketService";
import { YahooFinanceService } from "../../infrastructure/service/yahooFinanceService";
import { IPortfolioDashboardResponseDTO, IPaginatedPortfolioResponseDTO } from "../dto/portfolio.dto";
import puppeteer from "puppeteer";
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
    ) {}

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

        // We still need all portfolios for totalInvestment and notifications if we want to be accurate,
        // or we use some other way. For now, let's keep calculating dashboard stats based on the FULL data 
        // to ensure notifications and portfolio percentage are correct, but ONLY scraping CMP for the current page.
        // Actually, to follow SOLID and keep it clean, let's just paginate the DISPLAY data.
        
        const allPortfolios = await this._portfolioRepo.findAll(); // Getting all for total investment calculation
        const totalInvestment = allPortfolios.reduce((sum, p) => sum + p.getInvestment(), 0);

        const liveDataMap: Record<string, { cmp: number; peRatio: number | null; eps: number | null }> = {};
        
        // Find which stocks need fresh scraping
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
            const browser = await puppeteer.launch({ headless: true });
            
            try {
                const page = await browser.newPage();
                await page.setUserAgent("Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/122 Safari/537.36");

                for (const p of stocksToScrape) {
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
                }
            } catch (error) {
                console.error("Error fetching live data:", error);
            } finally {
                await browser.close();
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

        // Trigger notifications after mapping
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
                    // (Optional) Could notify drop, but user requested profit increases strictly
                }
                
                // Keep track of new CMP
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
