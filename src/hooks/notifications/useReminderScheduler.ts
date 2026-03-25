import dayjs from 'dayjs';
import { useEffect, useMemo } from 'react';

import { scheduleNotification } from '@/core/utils/notifications';
import {
    autoSaveNotification,
    markReminderScheduled,
    pruneReminderMetadata,
    shouldScheduleReminder,
} from '@/core/services/notifications';
import {
    useGetActiveWindowsQuery,
    useGetUpcomingEventsQuery,
    useGetUserPendingTasksQuery,
} from '@/store/api/api';

const MAX_LOOKAHEAD_MS = 14 * 24 * 60 * 60 * 1000; // 14 days
const WINDOW_LEAD_MS = 12 * 60 * 60 * 1000; // 12 hours
const EVENT_LEAD_MS = 6 * 60 * 60 * 1000; // 6 hours
const MIN_DELAY_SECONDS = 60;

type ReminderTarget = {
    id: string;
    title: string;
    body: string;
    timestamp: number;
    data?: Record<string, any>;
};

interface ReminderSchedulerOptions {
    enabled: boolean;
    userId?: number;
}

const toNumber = (value: unknown): number | undefined => {
    if (typeof value === 'number') {
        return value;
    }
    if (typeof value === 'string') {
        const parsed = Number(value);
        return Number.isNaN(parsed) ? undefined : parsed;
    }
    return undefined;
};

export function useReminderScheduler({ enabled, userId }: ReminderSchedulerOptions) {
    const numericUserId = toNumber(userId);
    const shouldSkipQueries = !enabled || !numericUserId;
    const { data: activeWindowsData } = useGetActiveWindowsQuery(undefined, {
        skip: shouldSkipQueries,
    });
    const { data: pendingTasksData } = useGetUserPendingTasksQuery(numericUserId ?? 0, {
        skip: shouldSkipQueries,
    });
    const { data: upcomingEventsData } = useGetUpcomingEventsQuery(undefined, {
        skip: shouldSkipQueries,
    });

    const reminders = useMemo<ReminderTarget[]>(() => {
        if (!enabled || !numericUserId) {
            return [];
        }
        const now = Date.now();
        const lookaheadLimit = now + MAX_LOOKAHEAD_MS;
        const targets: ReminderTarget[] = [];

        const windows = activeWindowsData?.result?.items ?? [];
        windows.forEach((item: any) => {
            const windowData = item?.discretionaryWindow ?? item;
            if (!windowData?.id || !windowData?.deadlineTime) {
                return;
            }
            const deadline = new Date(windowData.deadlineTime);
            const reminderTime = deadline.getTime() - WINDOW_LEAD_MS;
            if (deadline.getTime() < now || reminderTime <= now || reminderTime > lookaheadLimit) {
                return;
            }

            targets.push({
                id: `window-${windowData.id}-${deadline.toISOString()}`,
                title: `${windowData.title ?? 'Discretionary window'} closes soon`,
                body: `Submit your application before ${deadline.toLocaleString()}.`,
                timestamp: reminderTime,
                data: {
                    type: 'window',
                    windowId: windowData.id,
                    deadline: deadline.toISOString(),
                },
            });
        });

        const upcomingEvents = upcomingEventsData?.items ?? [];
        upcomingEvents.forEach((event: any, index: number) => {
            const startDate = event?.launchDte || event?.startDate || event?.start_time;
            if (!startDate) {
                return;
            }
            const eventDate = new Date(startDate);
            const reminderTime = eventDate.getTime() - EVENT_LEAD_MS;
            if (eventDate.getTime() < now || reminderTime <= now || reminderTime > lookaheadLimit) {
                return;
            }

            targets.push({
                id: `event-${event?.id ?? index}-${eventDate.toISOString()}`,
                title: `${event?.title ?? 'Upcoming event'} starts soon`,
                body: `Get ready for ${event?.title ?? 'your next event'} at ${eventDate.toLocaleString()}.`,
                timestamp: reminderTime,
                data: {
                    type: 'event',
                    eventId: event?.id ?? index,
                    startDate: eventDate.toISOString(),
                },
            });
        });

        const pendingCount = pendingTasksData?.items?.length ?? 0;
        if (pendingCount > 0) {
            let digest = dayjs().hour(9).minute(0).second(0).millisecond(0);
            if (digest.valueOf() <= now + MIN_DELAY_SECONDS * 1000) {
                digest = digest.add(1, 'day');
            }
            if (digest.valueOf() <= lookaheadLimit) {
                targets.push({
                    id: `pending-${digest.format('YYYY-MM-DD')}`,
                    title: 'Pending tasks reminder',
                    body: `You have ${pendingCount} pending task${pendingCount > 1 ? 's' : ''} waiting for your attention.`,
                    timestamp: digest.valueOf(),
                    data: {
                        type: 'pending_tasks',
                        count: pendingCount,
                    },
                });
            }
        }

        return targets;
    }, [activeWindowsData, enabled, numericUserId, pendingTasksData, upcomingEventsData]);

    useEffect(() => {
        if (!enabled || !numericUserId || reminders.length === 0) {
            return;
        }
        const reminderIds = reminders.map(reminder => reminder.id);
        pruneReminderMetadata(reminderIds).catch(error => {
            console.warn('Failed to prune reminder metadata', error);
        });
    }, [enabled, numericUserId, reminders]);

    useEffect(() => {
        if (!enabled || !numericUserId || reminders.length === 0) {
            return;
        }

        let cancelled = false;

        const scheduleReminders = async () => {
            for (const reminder of reminders) {
                if (cancelled) {
                    return;
                }

                const needsScheduling = await shouldScheduleReminder(reminder.id, reminder.timestamp);
                if (!needsScheduling) {
                    continue;
                }

                const secondsUntilTrigger = Math.floor((reminder.timestamp - Date.now()) / 1000);
                if (secondsUntilTrigger < MIN_DELAY_SECONDS) {
                    continue;
                }

                try {
                    const payloadData = {
                        ...reminder.data,
                        reminderId: reminder.id,
                    };

                    await scheduleNotification({
                        title: reminder.title,
                        body: reminder.body,
                        data: payloadData,
                        seconds: secondsUntilTrigger,
                    });

                    await autoSaveNotification(
                        reminder.title,
                        reminder.body,
                        payloadData,
                        {
                            id: reminder.id,
                            timestamp: reminder.timestamp,
                            read: false,
                            source: 'local',
                            userId: numericUserId,
                        },
                    );

                    await markReminderScheduled(reminder.id, reminder.timestamp);
                } catch (error) {
                    console.error('Failed to schedule reminder', reminder.id, error);
                }
            }
        };

        scheduleReminders();

        return () => {
            cancelled = true;
        };
    }, [enabled, numericUserId, reminders]);
}
