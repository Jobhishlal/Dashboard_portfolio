import { ICreatePortfolioUseCase } from "../interface/UsecaseInterface/IGetPortfolioDashboardUseCase";
import { IPortfolioDatabaseinterface } from "../interface/RepositoryInterface/IPortfolioInterface";
import { Portfolio } from "../../domain/entity/Portfolio";

export class PortfolioCreateUsecase implements ICreatePortfolioUseCase{
    constructor( private _portfolio:IPortfolioDatabaseinterface){}

    async execute(data: Portfolio): Promise<Portfolio> {
        

        if(!data.symbol){
            throw new Error("symbol is importent")

        }
        if(data.purchasePrice<=0){
            throw new Error("purchase amount must be greaterthan 0")

        }
        if(data.quantity<=0){
            throw new Error("quantity must be greaterthan 0")
        }


        const values = await this._portfolio.create(data)

        return values
    }
       
    
    
}
