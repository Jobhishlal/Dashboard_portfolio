export interface IPortfolioRequestDTO {
  symbol: string;
  purchasePrice: number;
  quantity: number;
  sector: string;
  exchange: string;
}

export interface IPortfolioResponseDTO {
  id: string;
  symbol: string;
  purchasePrice: number;
  quantity: number;
  sector: string;
  exchange: string;
}

export interface IPortfolioDashboardResponseDTO {
  id?: string;
  symbol: string;
  name: string;
  purchasePrice: number;
  quantity: number;
  investment: number;
  portfolioPercentage: number;
  exchange: string;
  cmp: number;
  presentValue: number;
  gainLoss: number;
  peRatio: number;
  eps: number;
  sector: string;
}

export interface IPaginatedPortfolioResponseDTO {
  data: IPortfolioDashboardResponseDTO[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}
