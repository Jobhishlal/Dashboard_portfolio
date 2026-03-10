import { ICreatePortfolioUseCase } from "../../application/interface/UsecaseInterface/IGetPortfolioDashboardUseCase";
import { IGetAllPortfoliosUseCase } from "../../application/interface/UsecaseInterface/IGetAllPortfoliosUseCase";
import { StatusCode } from "../../utils/statusCodes";
import { Request,Response } from "express";
import { SUCCESS_MESSAGES } from "../../utils/messages";
import { ERROR_MESSAGES } from "../../utils/messages";
export class PortfolioManagementcontroller {
    constructor(
        private readonly _create : ICreatePortfolioUseCase,
        private readonly _getAll: IGetAllPortfoliosUseCase
    ){}

    async createportfoli(req:Request,res:Response):Promise<void>{
        try {
            const data = await this._create.execute(req.body)
            if(!data){
                res.status(StatusCode.BAD_REQUEST).json({success:false,message:ERROR_MESSAGES.NOT_FOUND})
            } else {
                res.status(StatusCode.CREATED).json({success:true, message:SUCCESS_MESSAGES.CREATED, data})
            }
            
        } catch (error: any) {
            console.log(error)
            const message = error instanceof Error ? error.message : ERROR_MESSAGES.INTERNAL_SERVER_ERROR;
            res.status(StatusCode.BAD_REQUEST).json({success:false, message});
        }
    }

    async getAllPortfolios(req: Request, res: Response): Promise<void> {
        try {
            const page = parseInt(req.query.page as string) || 1;
            const limit = parseInt(req.query.limit as string) || 10;
            const data = await this._getAll.execute(page, limit);
            // console.log("data",data)
            res.status(StatusCode.OK).json({ success: true, message: SUCCESS_MESSAGES.CREATED, data });
        } catch (error: any) {
            console.log(error);
            const message = error instanceof Error ? error.message :ERROR_MESSAGES.INTERNAL_SERVER_ERROR;
            res.status(StatusCode.INTERNAL_SERVER_ERROR).json({ success: false, message }); 
        }
    }
}