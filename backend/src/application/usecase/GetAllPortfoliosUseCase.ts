import { IPortfolioDatabaseinterface } from "../interface/RepositoryInterface/IPortfolioInterface";
import { IGetAllPortfoliosUseCase } from "../interface/UsecaseInterface/IGetAllPortfoliosUseCase";
import { StockMarketService } from "../../infrastructure/service/stockMarketService";
import { IPortfolioDashboardResponseDTO, IPaginatedPortfolioResponseDTO } from "../dto/portfolio.dto";
import { ISendNotificationUseCase } from "./SendNotificationUseCase";

export class GetAllPortfoliosUseCase implements IGetAllPortfoliosUseCase {
    private previousCmpMap: Record<string, number> = {};
    private static cache: Record<string, {
        cmp: number;
        peRatio: number | null;
        eps: number | null;
        lastUpdated: number;
    }> = {};
    private static readonly CACHE_TTL_MS = 3600000; // 1 hour cache to reduce scraping

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

        // Process all portfolios in parallel for speed
        const scrapePromises = portfolios.map(async (p) => {
            const cached = GetAllPortfoliosUseCase.cache[p.symbol];

            if (cached && (now - cached.lastUpdated) < GetAllPortfoliosUseCase.CACHE_TTL_MS) {
                liveDataMap[p.symbol] = cached;
                return;
            }

            try {
                // Use the new fast StockMarketService
                const fundamentals = await StockMarketService.getStockData(p.symbol);

                const newData = {
                    cmp: fundamentals?.price || p.purchasePrice,
                    peRatio: fundamentals?.peRatio || null,
                    eps: fundamentals?.eps || null,
                    lastUpdated: now
                };

                liveDataMap[p.symbol] = newData;
                GetAllPortfoliosUseCase.cache[p.symbol] = newData;
            } catch (error) {
                console.error(`Error fetching live data for ${p.symbol}:`, error);
                liveDataMap[p.symbol] = {
                    cmp: p.purchasePrice,
                    peRatio: null,
                    eps: null,
                    lastUpdated: now
                };
            }
        });

        await Promise.all(scrapePromises);

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
