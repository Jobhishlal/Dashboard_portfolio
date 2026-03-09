import { IPortfolioDatabaseinterface } from "../interface/RepositoryInterface/IPortfolioInterface";
import { IGetAllPortfoliosUseCase } from "../interface/UsecaseInterface/IGetAllPortfoliosUseCase";
import { StockMarketService } from "../../infrastructure/service/stockMarketService";
import { YahooFinanceService } from "../../infrastructure/service/yahooFinanceService";
import { IPortfolioDashboardResponseDTO } from "../dto/portfolio.dto";
import puppeteer from "puppeteer";

export class GetAllPortfoliosUseCase implements IGetAllPortfoliosUseCase {
    constructor(private readonly _portfolioRepo: IPortfolioDatabaseinterface) {}

    async execute(): Promise<IPortfolioDashboardResponseDTO[]> {
        
        const portfolios = await this._portfolioRepo.findAll();
        
        if (!portfolios || portfolios.length === 0) {
            return [];
        }

        const totalInvestment = portfolios.reduce((sum, p) => sum + p.getInvestment(), 0);

        const browser = await puppeteer.launch({ headless: true });
        const page = await browser.newPage();
        await page.setUserAgent("Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/122 Safari/537.36");

        const liveDataMap: Record<string, { cmp: number; peRatio: number | null; eps: number | null }> = {};

        try {
            for (const p of portfolios) {
                if (!liveDataMap[p.symbol]) {
                    const cmp = await YahooFinanceService.getCMP(p.symbol);
                    const fundamentals = await StockMarketService.getStockData(page, p.symbol, p.exchange);
                    
                    liveDataMap[p.symbol] = {
                        cmp: cmp || fundamentals?.price || p.purchasePrice,
                        peRatio: fundamentals?.peRatio || null,
                        eps: fundamentals?.eps || null
                    };
                }
            }
        } catch (error) {
            console.error("Error fetching live data:", error);
        } finally {
            await browser.close();
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

        return responseData;
    }
}
