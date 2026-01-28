import { AppNotification } from '../types/notifications';
import { store } from '@/store/store';
import { saveNotification } from '@/store/slice/NotificationSlice';
import { api } from '@/store/api/api';

export const autoSaveNotification = async (
    title: string,
    body: string,
    data?: Record<string, any>,
    options: {
        id?: string;
        timestamp?: number;
        read?: boolean;
        source?: 'local' | 'push';
        userId?: number;
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

    // Save to local state
    store.dispatch(saveNotification(notification));

    // Save to server
    if (options.userId) {
        try {
            const payload: any = {
                title,
                body,
                data: typeof data === 'string' ? data : JSON.stringify(data || ''),
                source: options.source ?? 'local',
                userId: options.userId,
            };

            await store.dispatch(
                api.endpoints.createNotification.initiate(payload)
            );
        } catch (error) {
            console.error('Failed to save notification to server:', error);
        }
    }
};