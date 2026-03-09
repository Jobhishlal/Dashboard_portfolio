import mongoose, { Schema, Document } from 'mongoose';

export interface INotificationDocument extends Document {
    message: string;
    type: 'info' | 'success' | 'warning';
    timestamp: Date;
    isRead: boolean;
}

const NotificationSchema: Schema = new Schema({
    message: { type: String, required: true },
    type: { type: String, enum: ['info', 'success', 'warning'], required: true },
    timestamp: { type: Date, default: Date.now },
    isRead: { type: Boolean, default: false }
});

export const NotificationModel = mongoose.model<INotificationDocument>('Notification', NotificationSchema);
