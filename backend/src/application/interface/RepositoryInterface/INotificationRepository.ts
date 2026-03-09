import { Notification } from "../../../domain/entity/Notification";

export interface INotificationRepository {
    save(notification: Notification): Promise<Notification>;

    getRecent(limit: number): Promise<Notification[]>;

    markAsRead(id: string): Promise<Notification | null>;

    delete(id: string): Promise<void>;
    
    deleteAll(): Promise<void>;
}
