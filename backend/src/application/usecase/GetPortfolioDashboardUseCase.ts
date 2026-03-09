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

        const existingPortfolios = await this._portfolio.findAll();
        const isDuplicate = existingPortfolios.some(p => 
            p.symbol === data.symbol && 
            p.purchasePrice === data.purchasePrice && 
            p.quantity === data.quantity
        );

        if (isDuplicate) {
            throw new Error("Duplicate entry: A portfolio asset with the exact same symbol, purchase price, and quantity already exists.");
        }

        const values = await this._portfolio.create(data)

        return values
    }
       
    
    
}
