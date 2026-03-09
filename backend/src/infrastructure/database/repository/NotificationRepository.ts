import { Notification } from "../../../domain/entity/Notification";
import { INotificationRepository } from "../../../application/interface/RepositoryInterface/INotificationRepository";
import { NotificationModel } from "../../../infrastructure/database/model/NotificationModel";

export class NotificationRepository implements INotificationRepository {
    async save(notification: Notification): Promise<Notification> {
        const created = await NotificationModel.create({
            message: notification.message,
            type: notification.type,
            timestamp: notification.timestamp,
            isRead: notification.isRead
        });
        return new Notification(created._id.toString(), created.message, created.type, created.timestamp, created.isRead);
    }

    async getRecent(limit: number): Promise<Notification[]> {
        const notifications = await NotificationModel.find()
            .sort({ timestamp: -1 })
            .limit(limit);
            
        return notifications.map(n => new Notification(n._id.toString(), n.message, n.type, n.timestamp, n.isRead));
    }

    async markAsRead(id: string): Promise<Notification | null> {
        const updated = await NotificationModel.findByIdAndUpdate(id, { isRead: true }, { new: true });
        if (!updated) return null;
        return new Notification(updated._id.toString(), updated.message, updated.type, updated.timestamp, updated.isRead);
    }

    async delete(id: string): Promise<void> {
        await NotificationModel.findByIdAndDelete(id);
    }

    async deleteAll(): Promise<void> {
        await NotificationModel.deleteMany({});
    }
}
