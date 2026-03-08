import { PortfolioManagementcontroller } from "../controller/PortfolioManagement";
import { PortfolioCreateUsecase } from "../../application/usecase/GetPortfolioDashboardUseCase";
import { PortFolioDatas } from "../../infrastructure/repository/PortfolioRepository";

import { Router } from "express";


const repo = new PortFolioDatas()
const createusecase = new PortfolioCreateUsecase(repo)
const portfoliocontroller = new PortfolioManagementcontroller(createusecase)



const portfoliorouter = Router()

portfoliorouter.post('/portfolio/create',(req,res)=>
portfoliocontroller.createportfoli(req,res))


export default portfoliorouter