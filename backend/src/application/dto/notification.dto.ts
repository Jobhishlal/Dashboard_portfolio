export interface NotificationDTO {
    id: string;
    message: string;
    type: 'info' | 'success' | 'warning';
    timestamp: string;
    isRead: boolean;
}
