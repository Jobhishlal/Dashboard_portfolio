import { Router } from "express";
import { NotificationController } from "../controller/NotificationController";
import { NotificationRepository } from "../../infrastructure/database/repository/NotificationRepository";
import { GetRecentNotificationsUseCase } from "../../application/usecase/GetRecentNotificationsUseCase";
import { MarkNotificationAsReadUseCase, DeleteNotificationUseCase, ClearAllNotificationsUseCase } from "../../application/usecase/NotificationUseCases";
import { SocketService } from "../../infrastructure/service/SocketService";

const notificationRouter = Router();

const notificationRepository = new NotificationRepository();
const socketService = SocketService.getInstance();

const getRecentUseCase = new GetRecentNotificationsUseCase(notificationRepository);
const markAsReadUseCase = new MarkNotificationAsReadUseCase(notificationRepository);
const deleteUseCase = new DeleteNotificationUseCase(notificationRepository, socketService);
const clearAllUseCase = new ClearAllNotificationsUseCase(notificationRepository, socketService);

const notificationController = new NotificationController(
    getRecentUseCase,
    markAsReadUseCase,
    deleteUseCase,
    clearAllUseCase
);

notificationRouter.get('/recent',(req,res)=> notificationController.getRecent(req,res));
notificationRouter.put('/:id/read',(req,res)=> notificationController.markAsRead(req,res));
notificationRouter.delete('/:id', (req,res)=>notificationController.delete(req,res));
notificationRouter.delete('/', (req,res)=>notificationController.deleteAll(req,res));

export default notificationRouter;
