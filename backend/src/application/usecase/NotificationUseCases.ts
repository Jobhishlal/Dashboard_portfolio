import { INotificationRepository } from "../interface/RepositoryInterface/INotificationRepository";
import { INotificationSocketService } from "../interface/ServiceInterface/INotificationSocketService";

export interface IMarkNotificationAsReadUseCase {
    execute(id: string): Promise<void>;
}

export class MarkNotificationAsReadUseCase implements IMarkNotificationAsReadUseCase {
    constructor(private _notificationRepository: INotificationRepository) {}

    async execute(id: string): Promise<void> {
        await this._notificationRepository.markAsRead(id);
    }
}

export interface IDeleteNotificationUseCase {
    execute(id: string): Promise<void>;
}

export class DeleteNotificationUseCase implements IDeleteNotificationUseCase {
    constructor(
        private notificationRepository: INotificationRepository,
        private socketService: INotificationSocketService
    ) {}

    async execute(id: string): Promise<void> {
        await this.notificationRepository.delete(id);
        this.socketService.emitNotificationCleared(id);
    }
}

export interface IClearAllNotificationsUseCase {
    execute(): Promise<void>;
}

export class ClearAllNotificationsUseCase implements IClearAllNotificationsUseCase {
    constructor(
        private notificationRepository: INotificationRepository,
        private socketService: INotificationSocketService
    ) {}

    async execute(): Promise<void> {
        await this.notificationRepository.deleteAll();
        this.socketService.emitAllNotificationsCleared();
    }
}
