import { IPaginatedPortfolioResponseDTO } from "../../dto/portfolio.dto";

export interface IGetAllPortfoliosUseCase {
  execute(page?: number, limit?: number): Promise<IPaginatedPortfolioResponseDTO>;
}
