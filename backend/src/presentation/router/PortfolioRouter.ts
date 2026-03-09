import { PortfolioManagementcontroller } from "../controller/PortfolioManagement";
import { PortfolioCreateUsecase } from "../../application/usecase/GetPortfolioDashboardUseCase";
import { GetAllPortfoliosUseCase } from "../../application/usecase/GetAllPortfoliosUseCase";
import { PortFolioDatas } from "../../infrastructure/repository/PortfolioRepository";
import { SendNotificationUseCase } from "../../application/usecase/SendNotificationUseCase";
import { NotificationRepository } from "../../infrastructure/database/repository/NotificationRepository";
import { SocketService } from "../../infrastructure/service/SocketService";


import { Router } from "express";

const repo = new PortFolioDatas()
const notificationRepo = new NotificationRepository();
const socketService = SocketService.getInstance();
const sendNotificationUseCase = new SendNotificationUseCase(notificationRepo, socketService);

const createusecase = new PortfolioCreateUsecase(repo)
const getAllUseCase = new GetAllPortfoliosUseCase(repo, sendNotificationUseCase)

const portfoliocontroller = new PortfolioManagementcontroller(createusecase, getAllUseCase)

const portfoliorouter = Router()

portfoliorouter.post('/portfolio/create',(req,res)=>
    portfoliocontroller.createportfoli(req,res))

portfoliorouter.get('/portfolio/all', (req, res) => 
    portfoliocontroller.getAllPortfolios(req, res))

export default portfoliorouter