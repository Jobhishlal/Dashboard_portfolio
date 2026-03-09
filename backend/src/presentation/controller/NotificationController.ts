import { Request, Response } from "express";
import { GetRecentNotificationsUseCase } from "../../application/usecase/GetRecentNotificationsUseCase";
import { MarkNotificationAsReadUseCase, DeleteNotificationUseCase, ClearAllNotificationsUseCase } from "../../application/usecase/NotificationUseCases";
import { StatusCode } from "../../utils/statusCodes";

export class NotificationController {
    constructor(
        private _getRecentNotificationsUseCase: GetRecentNotificationsUseCase,
        private _markNotificationAsReadUseCase: MarkNotificationAsReadUseCase,
        private _deleteNotificationUseCase: DeleteNotificationUseCase,
        private _clearAllNotificationsUseCase: ClearAllNotificationsUseCase
    ) {}

    async getRecent(req: Request, res: Response): Promise<void> {
        try {
            const limit = req.query.limit ? parseInt(req.query.limit as string) : 10;


     const notifications = await this._getRecentNotificationsUseCase.execute(limit);
         // notification reached controller
            console.log("notification",notifications)

            res.status(StatusCode.OK).json(notifications);
        } catch (error: any) {
            res.status(StatusCode.INTERNAL_SERVER_ERROR).json({ message: error.message });
        }
    }

    async markAsRead(req: Request, res: Response): Promise<void> {
        try {
            await this._markNotificationAsReadUseCase.execute(req.params.id as string);


            res.status(StatusCode.OK).json({ success: true });

        } catch (error: any) {
            console.error(error)
            res.status(StatusCode.INTERNAL_SERVER_ERROR).json({ message: error.message });
        }
    }

    async delete(req: Request, res: Response): Promise<void> {
        try {
            await this._deleteNotificationUseCase.execute(req.params.id as string);

            res.status(StatusCode.OK).json({ success: true });
        } catch (error: any) {
            res.status(StatusCode.INTERNAL_SERVER_ERROR).json({ message: error.message });
        }
    }

    async deleteAll(req: Request, res: Response): Promise<void> {
        try {

       await this._clearAllNotificationsUseCase.execute();
        
      res.status(StatusCode.OK).json({ success: true });
        } catch (error: any) {
            console.error(error)
            res.status(StatusCode.INTERNAL_SERVER_ERROR).json({ message: error.message });
        }
    }
}
