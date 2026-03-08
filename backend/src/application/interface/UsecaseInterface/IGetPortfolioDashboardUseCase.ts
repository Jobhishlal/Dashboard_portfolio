import { Portfolio } from "../../../domain/entity/Portfolio";

export interface ICreatePortfolioUseCase {

 execute(data: Portfolio): Promise<Portfolio>

}