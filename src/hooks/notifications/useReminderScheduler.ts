import dayjs from 'dayjs';
import { useEffect, useMemo } from 'react';

import { scheduleNotification } from '@/core/utils/notifications';
import {
    autoSaveNotification,
    markReminderScheduled,
    markWeeklyReminderSent,
    pruneReminderMetadata,
    pruneWeeklyMeta,
    shouldScheduleReminder,
    shouldSendWeeklyReminder,
} from '@/core/services/notifications';
import {
    useGetActiveWindowsQuery,
    useGetOrgProjectsQuery,
    useGetUpcomingEventsQuery,
    useGetUserPendingTasksQuery,
} from '@/store/api/api';

// ─── Constants ───────────────────────────────────────────────────────────────────
const MAX_LOOKAHEAD_MS = 14 * 24 * 60 * 60 * 1000;
const WINDOW_LEAD_MS = 12 * 60 * 60 * 1000;
const EVENT_LEAD_MS = 6 * 60 * 60 * 1000;
const MIN_DELAY_SECONDS = 60;
const WEEKLY_TRIGGER_SECONDS = 10;

// ─── Types ───────────────────────────────────────────────────────────────────────
export type ReminderTarget = {
    id: string;
    title: string;
    body: string;
    timestamp: number;
    data?: Record<string, any>;
    /** When set, reminder uses weekly throttle instead of timestamp-based dedup. */
    weeklyKey?: string;
};

export interface BuildReminderTargetsParams {
    activeWindowsData: any;
    upcomingEventsData: any;
    pendingTasksData: any;
    orgProjectsData: any;
    now?: number;
}

export interface ReminderSchedulerOptions {
    enabled: boolean;
    userId?: number;
    orgId?: number;
}

// ─── Pure builder (exported for testing) ─────────────────────────────────────────

/**
 * Builds the list of reminder targets from raw API data.
 * Pure  no side effects, fully unit-testable.function 
 */
export function buildReminderTargets({
    activeWindowsData,
    upcomingEventsData,
    pendingTasksData,
    orgProjectsData,
    now = Date.now(),
}: BuildReminderTargetsParams): ReminderTarget[] {
    const lookaheadLimit = now + MAX_LOOKAHEAD_MS;
    const targets: ReminderTarget[] = [];

    // ── 1. Active window deadline reminders (time-based, within 14 days) ───────
    const windows: any[] = activeWindowsData?.result?.items ?? [];
    for (const item of windows) {
        const w = item?.discretionaryWindow ?? item;
        if (!w?.id || !w?.deadlineTime) continue;

        const deadline = new Date(w.deadlineTime).getTime();
        const reminderTime = deadline - WINDOW_LEAD_MS;
        if (deadline < now || reminderTime <= now || reminderTime > lookaheadLimit) continue;

        targets.push({
            id: `window-${w.id}-${new Date(deadline).toISOString()}`,
            title: `${w.title ?? 'Discretionary window'} closes soon`,
            body: `Submit your application before ${new Date(deadline).toLocaleString()}.`,
            timestamp: reminderTime,
            data: { type: 'window', windowId: w.id, deadline: new Date(deadline).toISOString() },
        });
    }

    // ── 2. Upcoming event launch reminders (time-based, within 14 days) ────────
    const upcomingEvents: any[] = upcomingEventsData?.items ?? [];
    for (const [index, event] of upcomingEvents.entries()) {
        const startRaw = event?.launchDte || event?.startDate || event?.start_time;
        if (!startRaw) continue;

        const eventTime = new Date(startRaw).getTime();
        const reminderTime = eventTime - EVENT_LEAD_MS;
        if (eventTime < now || reminderTime <= now || reminderTime > lookaheadLimit) continue;

        targets.push({
            id: `event-${event?.id ?? index}-${new Date(eventTime).toISOString()}`,
            title: `${event?.title ?? 'Upcoming event'} starts soon`,
            body: `Get ready for ${event?.title ?? 'your next event'} at ${new Date(eventTime).toLocaleString()}.`,
            timestamp: reminderTime,
            data: { type: 'event', eventId: event?.id ?? index, startDate: new Date(eventTime).toISOString() },
        });
    }

    // ── 3. Weekly: upcoming events exist ───────────────────────────────────────
    if (upcomingEvents.length > 0) {
        targets.push({
            id: `weekly-upcoming-events`,
            title: 'Upcoming grant events',
            body: `There ${upcomingEvents.length === 1 ? 'is 1 upcoming grant event' : `are ${upcomingEvents.length} upcoming grant events`}. Tap to view the schedule.`,
            timestamp: now + WEEKLY_TRIGGER_SECONDS * 1000,
            weeklyKey: 'upcoming-events',
            data: { type: 'upcoming_events', count: upcomingEvents.length },
        });
    }

    // ── 4. Weekly: active grant windows open ───────────────────────────────────
    const activeCount = windows.filter((item: any) => {
        const w = item?.discretionaryWindow ?? item;
        return w?.deadlineTime && new Date(w.deadlineTime).getTime() > now;
    }).length;

    if (activeCount > 0) {
        targets.push({
            id: `weekly-active-grants`,
            title: 'Grant windows are open',
            body: `${activeCount} discretionary grant window${activeCount > 1 ? 's are' : ' is'} currently open. Don't miss the deadline.`,
            timestamp: now + WEEKLY_TRIGGER_SECONDS * 1000,
            weeklyKey: 'active-grants',
            data: { type: 'active_grants', count: activeCount },
        });
    }

    // ── 5. Weekly: pending tasks ───────────────────────────────────────────────
    const pendingCount: number = pendingTasksData?.items?.length ?? 0;
    if (pendingCount > 0) {
        targets.push({
            id: `weekly-pending-tasks`,
            title: 'Pending tasks awaiting you',
            body: `You have ${pendingCount} pending task${pendingCount > 1 ? 's' : ''} that need your attention.`,
            timestamp: now + WEEKLY_TRIGGER_SECONDS * 1000,
            weeklyKey: 'pending-tasks',
            data: { type: 'pending_tasks', count: pendingCount },
        });
    }

    // ── 6. Weekly: registered DG applications with open deadline ───────────────
    const orgProjects: any[] = orgProjectsData?.items ?? [];
    const registeredApps = orgProjects.filter((p: any) => {
        const isRegistered = p?.projectStatus?.toLowerCase().includes('registered');
        const endDate = p?.endDate ? new Date(p.endDate).getTime() : null;
        const deadlineOpen = endDate == null || endDate > now;
        return isRegistered && deadlineOpen;
    });

    if (registeredApps.length > 0) {
        targets.push({
            id: `weekly-registered-dg-apps`,
            title: 'Complete your DG application',
            body: `You have ${registeredApps.length} registered discretionary grant application${registeredApps.length > 1 ? 's' : ''} awaiting submission. Complete before the window closes.`,
            timestamp: now + WEEKLY_TRIGGER_SECONDS * 1000,
            weeklyKey: 'registered-dg-apps',
            data: { type: 'registered_dg_apps', count: registeredApps.length },
        });
    }

    return targets;
}

// ─── Hook ────────────────────────────────────────────────────────────────────────
const toNumber = (value: unknown): number | undefined => {
    if (typeof value === 'number') return value;
    if (typeof value === 'string') {
        const parsed = Number(value);
        return Number.isNaN(parsed) ? undefined : parsed;
    }
    return undefined;
};

export function useReminderScheduler({ enabled, userId, orgId }: ReminderSchedulerOptions) {
    const numericUserId = toNumber(userId);
    const skip = !enabled || !numericUserId;

    const { data: activeWindowsData } = useGetActiveWindowsQuery(undefined, { skip });
    const { data: pendingTasksData } = useGetUserPendingTasksQuery(numericUserId ?? 0, { skip });
    const { data: upcomingEventsData } = useGetUpcomingEventsQuery(undefined, { skip });
    const { data: orgProjectsData } = useGetOrgProjectsQuery(orgId!, {
        skip: skip || !orgId,
    });

    const reminders = useMemo<ReminderTarget[]>(() => {
        if (skip) return [];
        return buildReminderTargets({
            activeWindowsData,
            upcomingEventsData,
            pendingTasksData,
            orgProjectsData,
        });
    }, [activeWindowsData, orgProjectsData, pendingTasksData, skip, upcomingEventsData]);

    // Prune stale metadata when the reminder list changes
    useEffect(() => {
        if (skip || reminders.length === 0) return;

        const ids = reminders.filter(r => !r.weeklyKey).map(r => r.id);
        const weeklyKeys = reminders
            .filter(r => r.weeklyKey)
            .map(r => `${r.weeklyKey}-${numericUserId}`);

        pruneReminderMetadata(ids).catch(e => console.warn('prune reminder meta failed', e));
        pruneWeeklyMeta(weeklyKeys).catch(e => console.warn('prune weekly meta failed', e));
    }, [numericUserId, reminders, skip]);

    // Schedule reminders
    useEffect(() => {
        if (skip || reminders.length === 0) return;

        let cancelled = false;

        const run = async () => {
            for (const reminder of reminders) {
                if (cancelled) return;

                const isWeekly = !!reminder.weeklyKey;
                const weeklyMetaKey = isWeekly
                    ? `${reminder.weeklyKey}-${numericUserId}`
                    : null;

                // Gate check
                if (isWeekly) {
                    const shouldSend = await shouldSendWeeklyReminder(weeklyMetaKey!);
                    if (!shouldSend) continue;
                } else {
                    const needsScheduling = await shouldScheduleReminder(
                        reminder.id,
                        reminder.timestamp,
                    );
                    if (!needsScheduling) continue;
                }

                const secondsUntilTrigger = Math.max(
                    MIN_DELAY_SECONDS,
                    Math.floor((reminder.timestamp - Date.now()) / 1000),
                );

                const payloadData = { ...reminder.data, reminderId: reminder.id };

                try {
                    await scheduleNotification({
                        title: reminder.title,
                        body: reminder.body,
                        data: payloadData,
                        seconds: isWeekly ? WEEKLY_TRIGGER_SECONDS : secondsUntilTrigger,
                    });

                    await autoSaveNotification(reminder.title, reminder.body, payloadData, {
                        id: reminder.id,
                        timestamp: reminder.timestamp,
                        read: false,
                        source: 'local',
                        userId: numericUserId,
                    });

                    if (isWeekly) {
                        await markWeeklyReminderSent(weeklyMetaKey!);
                    } else {
                        await markReminderScheduled(reminder.id, reminder.timestamp);
                    }
                } catch (error) {
                    console.error('Failed to schedule reminder', reminder.id, error);
                }
            }
        };

        run();

        return () => {
            cancelled = true;
        };
    }, [numericUserId, reminders, skip]);
}
