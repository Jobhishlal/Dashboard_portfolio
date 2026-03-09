import { IPortfolioDashboardResponseDTO } from "../../dto/portfolio.dto";

export interface IGetAllPortfoliosUseCase {
  execute(): Promise<IPortfolioDashboardResponseDTO[]>;
}
