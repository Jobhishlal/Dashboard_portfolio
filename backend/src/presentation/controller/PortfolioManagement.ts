import { ICreatePortfolioUseCase } from "../../application/interface/UsecaseInterface/IGetPortfolioDashboardUseCase";
import { StatusCode } from "../../utils/statusCodes";
import { Request,Response } from "express";


export class PortfolioManagementcontroller {
    constructor(private readonly _create : ICreatePortfolioUseCase){}

    async createportfoli(req:Request,res:Response):Promise<void>{
        try {
            const data = await this._create.execute(req.body)
            if(!data){
                res.status(StatusCode.BAD_REQUEST).json({success:false,message:'datas are not get it'})
            }
            res.status(StatusCode.CREATED).json({success:true,message:"portfolio create successfully"})
            
        } catch (error) {
            res.status(StatusCode.INTERNAL_SERVER_ERROR).json({success:false,message:error})
        }
    }
}