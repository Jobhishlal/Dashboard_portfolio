import { Notification } from "../../domain/entity/Notification";
import { NotificationDTO } from "../dto/notification.dto";
import { INotificationRepository } from "../interface/RepositoryInterface/INotificationRepository";
import { INotificationSocketService } from "../interface/ServiceInterface/INotificationSocketService";

export interface ISendNotificationUseCase {
    execute(message: string, type: 'info' | 'success' | 'warning'): Promise<NotificationDTO>;
}

export class SendNotificationUseCase implements ISendNotificationUseCase {
    constructor(
        private _notificationRepository: INotificationRepository,
        private _socketService: INotificationSocketService
    ) {}

    async execute(message: string, type: 'info' | 'success' | 'warning'): Promise<NotificationDTO> {
        const notification = new Notification(null, message, type, new Date(), false);
        const savedNotification = await this._notificationRepository.save(notification);
        
        const dto: NotificationDTO = {
            id: savedNotification.id!,
            message: savedNotification.message,
            type: savedNotification.type,
            timestamp: savedNotification.timestamp.toISOString(),
            isRead: savedNotification.isRead
        };

        this._socketService.emitNewNotification(dto);
        return dto;
    }
}
