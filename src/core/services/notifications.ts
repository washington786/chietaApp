import AsyncStorage from '@react-native-async-storage/async-storage';

import { AppNotification } from '../types/notifications';
import { store } from '@/store/store';
import { saveNotification } from '@/store/slice/NotificationSlice';
import { api } from '@/store/api/api';
import { enqueueOfflineRequest } from '@/core/services/offlineQueue';
import { logger } from '@/utils/logger';

const REMINDER_META_KEY = '@chieta/reminders/meta';
const WEEKLY_META_KEY = '@chieta/reminders/weekly';

const WEEK_MS = 24 * 60 * 60 * 1000;

type ReminderMeta = Record<string, number>;

async function readReminderMeta(): Promise<ReminderMeta> {
    try {
        const value = await AsyncStorage.getItem(REMINDER_META_KEY);
        if (!value) {
            return {};
        }
        return JSON.parse(value) as ReminderMeta;
    } catch (error) {
        console.warn('Failed to read reminder metadata', error);
        return {};
    }
}

async function writeReminderMeta(meta: ReminderMeta) {
    try {
        await AsyncStorage.setItem(REMINDER_META_KEY, JSON.stringify(meta));
    } catch (error) {
        console.warn('Failed to persist reminder metadata', error);
    }
}

export async function shouldScheduleReminder(reminderId: string, timestamp: number) {
    const meta = await readReminderMeta();
    return meta[reminderId] !== timestamp;
}

export async function markReminderScheduled(reminderId: string, timestamp: number) {
    const meta = await readReminderMeta();
    meta[reminderId] = timestamp;
    await writeReminderMeta(meta);
}

export async function pruneReminderMetadata(validIds: string[]) {
    const meta = await readReminderMeta();
    const validSet = new Set(validIds);
    let dirty = false;
    Object.keys(meta).forEach(key => {
        if (!validSet.has(key)) {
            delete meta[key];
            dirty = true;
        }
    });
    if (dirty) {
        await writeReminderMeta(meta);
    }
}

// ─── Weekly reminder throttle ─────────────────────────────────────────────────

async function readWeeklyMeta(): Promise<ReminderMeta> {
    try {
        const value = await AsyncStorage.getItem(WEEKLY_META_KEY);
        return value ? (JSON.parse(value) as ReminderMeta) : {};
    } catch {
        return {};
    }
}

async function writeWeeklyMeta(meta: ReminderMeta): Promise<void> {
    try {
        await AsyncStorage.setItem(WEEKLY_META_KEY, JSON.stringify(meta));
    } catch (error) {
        console.warn('Failed to persist weekly reminder metadata', error);
    }
}

/**
 * Returns true when no reminder with this key has been sent in the last day.
 */
export async function shouldSendWeeklyReminder(key: string): Promise<boolean> {
    const meta = await readWeeklyMeta();
    const lastSent = meta[key];
    return !lastSent || Date.now() - lastSent > WEEK_MS;
}

/**
 * Stamps the current time as the last-sent timestamp for this key.
 */
export async function markWeeklyReminderSent(key: string): Promise<void> {
    const meta = await readWeeklyMeta();
    meta[key] = Date.now();
    await writeWeeklyMeta(meta);
}

/**
 * Removes stale keys that are no longer relevant (e.g. after logout).
 */
export async function pruneWeeklyMeta(validKeys: string[]): Promise<void> {
    const meta = await readWeeklyMeta();
    const validSet = new Set(validKeys);
    let dirty = false;
    for (const key of Object.keys(meta)) {
        if (!validSet.has(key)) {
            delete meta[key];
            dirty = true;
        }
    }
    if (dirty) await writeWeeklyMeta(meta);
}

// ─── Re-export WEEK_MS for use in tests ───────────────────────────────────────
export { WEEK_MS };

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
        const payload: any = {
            title,
            body,
            data: typeof data === 'string' ? data : JSON.stringify(data || ''),
            source: options.source ?? 'local',
            userId: options.userId,
            id,
        };

        try {
            await store
                .dispatch(api.endpoints.createNotification.initiate(payload))
                .unwrap();
        } catch (error) {
            logger.warn('Failed to save notification remotely, queueing', {
                id,
                userId: options.userId,
            });
            await enqueueOfflineRequest('notification', payload);
        }
    }
};
