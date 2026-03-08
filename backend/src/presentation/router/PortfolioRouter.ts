import { PortfolioManagementcontroller } from "../controller/PortfolioManagement";
import { PortfolioCreateUsecase } from "../../application/usecase/GetPortfolioDashboardUseCase";
import { GetAllPortfoliosUseCase } from "../../application/usecase/GetAllPortfoliosUseCase";
import { PortFolioDatas } from "../../infrastructure/repository/PortfolioRepository";

import { Router } from "express";

const repo = new PortFolioDatas()
const createusecase = new PortfolioCreateUsecase(repo)
const getAllUseCase = new GetAllPortfoliosUseCase(repo)

const portfoliocontroller = new PortfolioManagementcontroller(createusecase, getAllUseCase)

const portfoliorouter = Router()

portfoliorouter.post('/portfolio/create',(req,res)=>
    portfoliocontroller.createportfoli(req,res))

portfoliorouter.get('/portfolio/all', (req, res) => 
    portfoliocontroller.getAllPortfolios(req, res))

export default portfoliorouter