import { Server as SocketIOServer } from 'socket.io';
import { INotificationSocketService } from '../../application/interface/ServiceInterface/INotificationSocketService';
import { NotificationDTO } from '../../application/dto/notification.dto';
import http from 'http';

export class SocketService implements INotificationSocketService {
    private static instance: SocketService;
    private io: SocketIOServer | null = null;

    private constructor() {}

    public static getInstance(): SocketService {
        if (!SocketService.instance) {
            SocketService.instance = new SocketService();
        }
        return SocketService.instance;
    }

    public initialize(server: http.Server): void {
        this.io = new SocketIOServer(server, {
            cors: {
                origin: "*", 
                methods: ["GET", "POST", "DELETE"]
            }
        });

        this.io.on('connection', (socket) => {
            console.log(`Client connected: ${socket.id}`);
            
            socket.on('disconnect', () => {
                console.log(`Client disconnected: ${socket.id}`);
            });
        });
    }

    public emitNewNotification(notification: NotificationDTO): void {
        if (this.io) {
            this.io.emit('new_notification', notification);
        }
    }

    public emitNotificationCleared(notificationId: string): void {
        if (this.io) {
            this.io.emit('notification_cleared', notificationId);
        }
    }

    public emitAllNotificationsCleared(): void {
        if (this.io) {
            this.io.emit('all_notifications_cleared');
        }
    }
}
