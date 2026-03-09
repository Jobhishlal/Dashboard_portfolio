import { io, Socket } from 'socket.io-client';

class SocketService {
  private socket: Socket | null = null;
  private readonly URL = 'http://127.0.0.1:5000'; // Make sure this matches your backend URL.
  
  public connect(): void {
    if (!this.socket) {
      this.socket = io(this.URL, {
        transports: ['websocket'],
        reconnectionAttempts: 5,
        reconnectionDelay: 5000,
      });
      
      this.socket.on('connect', () => {
        console.log('Connected to notification socket server');
      });
      
      this.socket.on('disconnect', () => {
        console.log('Disconnected from socket server');
      });
    }
  }

  public disconnect(): void {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
    }
  }

  public onNotification(callback: (notification: any) => void): void {
    if (this.socket) {
      this.socket.on('new_notification', callback);
    }
  }

  public offNotification(callback: (notification: any) => void): void {
    if (this.socket) {
      this.socket.off('new_notification', callback);
    }
  }
  
  public onNotificationCleared(callback: (notificationId: string) => void): void {
    if (this.socket) {
      this.socket.on('notification_cleared', callback);
    }
  }
  
  public offNotificationCleared(callback: (notificationId: string) => void): void {
    if (this.socket) {
      this.socket.off('notification_cleared', callback);
    }
  }
  
  public onAllNotificationsCleared(callback: () => void): void {
    if (this.socket) {
      this.socket.on('all_notifications_cleared', callback);
    }
  }
  
  public offAllNotificationsCleared(callback: () => void): void {
    if (this.socket) {
      this.socket.off('all_notifications_cleared', callback);
    }
  }
}

export const socketService = new SocketService();
