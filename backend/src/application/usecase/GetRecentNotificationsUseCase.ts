import { NotificationDTO } from "../dto/notification.dto";
import { INotificationRepository } from "../interface/RepositoryInterface/INotificationRepository";

export interface IGetRecentNotificationsUseCase {
    execute(limit?: number): Promise<NotificationDTO[]>;
}

export class GetRecentNotificationsUseCase implements IGetRecentNotificationsUseCase {
    constructor(private _notificationRepository: INotificationRepository) {}

    async execute(limit: number = 10): Promise<NotificationDTO[]> {
        const notifications = await this._notificationRepository.getRecent(limit);
        return notifications.map((n: any) => ({
            id: n.id!,
            message: n.message,
            type: n.type,
            timestamp: n.timestamp.toISOString(),
            isRead: n.isRead
        }));
    }
}
