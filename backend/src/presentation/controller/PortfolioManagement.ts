import { ICreatePortfolioUseCase } from "../../application/interface/UsecaseInterface/IGetPortfolioDashboardUseCase";
import { IGetAllPortfoliosUseCase } from "../../application/interface/UsecaseInterface/IGetAllPortfoliosUseCase";
import { StatusCode } from "../../utils/statusCodes";
import { Request,Response } from "express";

export class PortfolioManagementcontroller {
    constructor(
        private readonly _create : ICreatePortfolioUseCase,
        private readonly _getAll: IGetAllPortfoliosUseCase
    ){}

    async createportfoli(req:Request,res:Response):Promise<void>{
        try {
            const data = await this._create.execute(req.body)
            if(!data){
                res.status(StatusCode.BAD_REQUEST).json({success:false,message:'datas are not get it'})
            } else {
                res.status(StatusCode.CREATED).json({success:true, message:"portfolio create successfully", data})
            }
            
        } catch (error: any) {
            console.log(error)
            const message = error instanceof Error ? error.message : "Internal Server Error";
            res.status(StatusCode.BAD_REQUEST).json({success:false, message});
        }
    }

    async getAllPortfolios(req: Request, res: Response): Promise<void> {
        try {
            const data = await this._getAll.execute();
            res.status(StatusCode.OK).json({ success: true, message: "Portfolios retrieved successfully", data });
        } catch (error: any) {
            console.log(error);
            const message = error instanceof Error ? error.message : "Internal Server Error";
            res.status(StatusCode.INTERNAL_SERVER_ERROR).json({ success: false, message });
        }
    }
}