import { AppNotification } from '../types/notifications';
import { store } from '@/store/store';
import { saveNotification } from '@/store/slice/NotificationSlice';

export const autoSaveNotification = (
    title: string,
    body: string,
    data?: Record<string, any>,
    options: {
        id?: string;
        timestamp?: number;
        read?: boolean;
        source?: 'local' | 'push';
    } = {}
) => {
    const id = options.id || Date.now().toString();
    const notification: AppNotification = {
        id,
        title,
        body,
        data,
        timestamp: options.timestamp ?? Date.now(),
        read: options.read ?? false,
        source: options.source ?? 'local',
    };

    store.dispatch(saveNotification(notification));
};