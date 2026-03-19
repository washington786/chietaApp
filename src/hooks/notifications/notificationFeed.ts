import { AppNotification } from '@/core/types/notifications';

export type NotificationCategory = 'reminder' | 'system';

export type CombinedNotification = AppNotification & {
    category: NotificationCategory;
    dedupeKey: string;
    serverId?: string;
    isLocal: boolean;
};

const REMINDER_TYPES = new Set(['reminder', 'window', 'event', 'pending_tasks']);

const deriveCategory = (notification: AppNotification): NotificationCategory => {
    if (notification.source === 'local') {
        return 'reminder';
    }
    const type = notification.data?.type || notification.source;
    return REMINDER_TYPES.has(String(type)) ? 'reminder' : 'system';
};

export function buildCombinedNotifications(
    localNotifications: AppNotification[],
    serverNotifications?: AppNotification[],
) {
    const map = new Map<string, CombinedNotification>();

    const upsert = (notification: AppNotification, options: { category?: NotificationCategory; serverId?: string; isLocal: boolean }) => {
        const category = options.category ?? deriveCategory(notification);
        const dedupeKey = notification.data?.reminderId
            ? String(notification.data.reminderId)
            : notification.id;
        const existing = map.get(dedupeKey);
        const resolved: CombinedNotification = existing
            ? { ...existing }
            : {
                ...notification,
                category,
                dedupeKey,
                serverId: options.serverId,
                isLocal: options.isLocal,
            };

        if (existing) {
            resolved.read = existing.read && notification.read;
            resolved.timestamp = Math.max(existing.timestamp, notification.timestamp);
            resolved.data = { ...existing.data, ...notification.data };
            resolved.source = notification.source || existing.source;
            resolved.serverId = options.serverId ?? existing.serverId;
            resolved.isLocal = existing.isLocal || options.isLocal;
        } else {
            resolved.serverId = options.serverId;
        }

        map.set(dedupeKey, resolved);
    };

    localNotifications.forEach(notification => {
        upsert(notification, { isLocal: true });
    });

    serverNotifications?.forEach(notification => {
        upsert(notification, { serverId: notification.id, isLocal: false });
    });

    const sorted = Array.from(map.values()).sort(
        (a, b) => b.timestamp - a.timestamp,
    );

    const remindersList = sorted.filter(item => item.category === 'reminder');
    const systemList = sorted.filter(item => item.category === 'system');

    const unreadRemindersCount = remindersList.filter(item => !item.read).length;
    const unreadSystemCount = systemList.filter(item => !item.read).length;

    return {
        reminders: remindersList,
        system: systemList,
        unreadReminders: unreadRemindersCount,
        unreadSystem: unreadSystemCount,
        all: sorted,
    };
}
