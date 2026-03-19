import { describe, expect, it } from 'vitest';

import { buildCombinedNotifications } from '../notificationFeed';
import { AppNotification } from '@/core/types/notifications';

const createNotification = (overrides: Partial<AppNotification>): AppNotification => ({
    id: 'notification-id',
    title: 'Test notification',
    body: 'Body',
    timestamp: Date.now(),
    read: false,
    source: 'system',
    data: {},
    ...overrides,
});

describe('buildCombinedNotifications', () => {
    it('dedupes reminders by reminderId and keeps unread state', () => {
        const local = [
            createNotification({
                id: 'rem-1',
                source: 'local',
                timestamp: 1_000,
                data: { type: 'window', reminderId: 'rem-1' },
            }),
        ];

        const server = [
            createNotification({
                id: '101',
                source: 'reminder',
                read: true,
                timestamp: 2_000,
                data: { type: 'window', reminderId: 'rem-1' },
            }),
        ];

        const result = buildCombinedNotifications(local, server);

        expect(result.reminders).toHaveLength(1);
        const reminder = result.reminders[0];
        expect(reminder.id).toBe('rem-1');
        expect(reminder.serverId).toBe('101');
        expect(reminder.read).toBe(false);
        expect(result.unreadReminders).toBe(1);
    });

    it('categorises system notifications correctly', () => {
        const server = [
            createNotification({
                id: 'sys-1',
                source: 'system',
                read: false,
                timestamp: 500,
            }),
        ];

        const result = buildCombinedNotifications([], server);

        expect(result.system).toHaveLength(1);
        expect(result.reminders).toHaveLength(0);
        expect(result.unreadSystem).toBe(1);
    });

    it('treats local push notifications without reminder metadata as system', () => {
        const local = [
            createNotification({
                id: 'push-1',
                source: 'push',
                read: false,
                timestamp: 300,
            }),
        ];

        const result = buildCombinedNotifications(local, []);

        expect(result.system).toHaveLength(1);
        expect(result.system[0].id).toBe('push-1');
        expect(result.reminders).toHaveLength(0);
    });
});
