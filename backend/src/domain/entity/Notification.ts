export class Notification {
    constructor(
        public readonly id: string | null,
        public readonly message: string,
        public readonly type: 'info' | 'success' | 'warning',
        public readonly timestamp: Date,
        public readonly isRead: boolean
    ) {}

    public markAsRead(): Notification {
        return new Notification(this.id, this.message, this.type, this.timestamp, true);
    }
}
