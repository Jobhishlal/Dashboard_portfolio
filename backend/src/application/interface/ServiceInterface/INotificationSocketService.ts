import { NotificationDTO } from "../../dto/notification.dto";

export interface INotificationSocketService {
    emitNewNotification(notification: NotificationDTO): void;

    emitNotificationCleared(notificationId: string): void;
    
    emitAllNotificationsCleared(): void;
}
