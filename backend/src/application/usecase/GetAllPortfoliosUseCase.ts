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
    private static readonly CACHE_TTL_MS = 15000; // 15 seconds cache for real-time updates

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

                if (prevCmp && p.cmp !== prevCmp) {
                    const diff = p.cmp - prevCmp;
                    const change = ((diff / prevCmp) * 100).toFixed(2);
                    const type = diff > 0 ? 'success' : 'warning';
                    const icon = diff > 0 ? '📈' : '📉';

                    void this._sendNotificationUseCase.execute(
                        `${icon} ${p.symbol} price moved by ${change}% to ₹${p.cmp}!`,
                        type
                    );
                } else if (!prevCmp) {
                    // Initial notification for stocks with significant profit or loss (> 5%)
                    const diffFromPurchase = p.cmp - p.purchasePrice;
                    const profitPct = (diffFromPurchase / p.purchasePrice) * 100;

                    if (Math.abs(profitPct) > 5) {
                        const type = profitPct > 0 ? 'success' : 'warning';
                        const emoji = profitPct > 0 ? '🔥' : '⚠️';
                        void this._sendNotificationUseCase.execute(
                            `${emoji} ${p.symbol} performance: ${profitPct.toFixed(2)}% (₹${p.gainLoss.toFixed(2)})`,
                            type
                        );
                    }
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
