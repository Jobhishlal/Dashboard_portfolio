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
