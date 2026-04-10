import { beforeEach, describe, expect, it, vi } from 'vitest'
import {
    buildReminderTargets,
    BuildReminderTargetsParams,
} from '@/hooks/notifications/useReminderScheduler'
import {
    markWeeklyReminderSent,
    shouldSendWeeklyReminder,
    WEEK_MS,
} from '@/core/services/notifications'

// ─── Mock AsyncStorage ───────────────────────────────────────────────────────────
const store: Record<string, string> = {}

vi.mock('@react-native-async-storage/async-storage', () => ({
    default: {
        getItem: vi.fn(async (key: string) => store[key] ?? null),
        setItem: vi.fn(async (key: string, value: string) => { store[key] = value }),
        removeItem: vi.fn(async (key: string) => { delete store[key] }),
    },
}))

// Silence other unresolved module imports used by notifications.ts
vi.mock('@/store/store', () => ({ store: { dispatch: vi.fn() } }))
vi.mock('@/store/slice/NotificationSlice', () => ({ saveNotification: vi.fn() }))
vi.mock('@/store/api/api', () => ({ api: { endpoints: { createNotification: { initiate: vi.fn() } } } }))
vi.mock('@/core/services/offlineQueue', () => ({ enqueueOfflineRequest: vi.fn() }))
vi.mock('@/utils/logger', () => ({ logger: { warn: vi.fn(), error: vi.fn() } }))
// Prevent expo-notifications / expo-device / react-native from loading in the Node test env
vi.mock('@/core/utils/notifications', () => ({ scheduleNotification: vi.fn().mockResolvedValue('mock-notif-id') }))
vi.mock('react-native', () => ({ Platform: { OS: 'ios' } }))
vi.mock('expo-notifications', () => ({}))
vi.mock('expo-device', () => ({}))

// ─── Helpers ────────────────────────────────────────────────────────────────────────
const NOW = new Date('2026-04-10T10:00:00.000Z').getTime()

const makeWindow = (id: number, deadlineOffsetMs: number) => ({
    discretionaryWindow: {
        id,
        title: `Window ${id}`,
        deadlineTime: new Date(NOW + deadlineOffsetMs).toISOString(),
    },
})

const makeEvent = (id: number, launchOffsetMs: number) => ({
    id,
    title: `Event ${id}`,
    launchDte: new Date(NOW + launchOffsetMs).toISOString(),
})

const makeProject = (id: number, status: string, endOffsetMs: number | null = null) => ({
    id,
    projectStatus: status,
    endDate: endOffsetMs != null ? new Date(NOW + endOffsetMs).toISOString() : null,
})

const baseParams = (): BuildReminderTargetsParams => ({
    activeWindowsData: { result: { items: [] } },
    upcomingEventsData: { items: [] },
    pendingTasksData: { items: [] },
    orgProjectsData: { items: [] },
    now: NOW,
})

// ─── Tests: buildReminderTargets ────────────────────────────────────────────────

describe(' time-based window reminders', () => {
    buildReminderTargets
    it('schedules a reminder 12h before a window deadline within 14 days', () => {
        const twoDays = 2 * 24 * 60 * 60 * 1000
        const params = {
            ...baseParams(),
            activeWindowsData: { result: { items: [makeWindow(1, twoDays)] } },
        }
        const targets = buildReminderTargets(params)
        const window = targets.find(t => t.id.startsWith('window-1'))
        expect(window).toBeDefined()
        expect(window!.weeklyKey).toBeUndefined()
        const deadline = NOW + twoDays
        expect(window!.timestamp).toBe(deadline - 12 * 60 * 60 * 1000)
    })

    it('skips windows whose deadline has already passed', () => {
        const params = {
            ...baseParams(),
            activeWindowsData: { result: { items: [makeWindow(1, -1000)] } },
        }
        const targets = buildReminderTargets(params)
        expect(targets.find(t => t.id.startsWith('window-1'))).toBeUndefined()
    })

    it('skips windows beyond the 14-day lookahead', () => {
        const sixteenDays = 16 * 24 * 60 * 60 * 1000
        const params = {
            ...baseParams(),
            activeWindowsData: { result: { items: [makeWindow(1, sixteenDays)] } },
        }
        const targets = buildReminderTargets(params)
        expect(targets.find(t => t.id.startsWith('window-1'))).toBeUndefined()
    })
})

describe(' time-based event reminders', () => {
    buildReminderTargets
    it('schedules a reminder 6h before an event launch within 14 days', () => {
        const threeDays = 3 * 24 * 60 * 60 * 1000
        const params = {
            ...baseParams(),
            upcomingEventsData: { items: [makeEvent(5, threeDays)] },
        }
        const targets = buildReminderTargets(params)
        const event = targets.find(t => t.id.startsWith('event-5'))
        expect(event).toBeDefined()
        expect(event!.timestamp).toBe(NOW + threeDays - 6 * 60 * 60 * 1000)
    })

    it('skips events that have already started', () => {
        const params = {
            ...baseParams(),
            upcomingEventsData: { items: [makeEvent(5, -500)] },
        }
        expect(buildReminderTargets(params).find(t => t.id.startsWith('event-5'))).toBeUndefined()
    })
})

describe(' weekly: upcoming events', () => {
    buildReminderTargets
    it('produces a weekly reminder when upcoming events exist', () => {
        const params = {
            ...baseParams(),
            upcomingEventsData: { items: [makeEvent(1, 4 * 24 * 60 * 60 * 1000)] },
        }
        const target = buildReminderTargets(params).find(t => t.id === 'weekly-upcoming-events')
        expect(target).toBeDefined()
        expect(target!.weeklyKey).toBe('upcoming-events')
        expect(target!.body).toContain('1 upcoming grant event')
    })

    it('counts multiple events correctly in body', () => {
        const day = 24 * 60 * 60 * 1000
        const params = {
            ...baseParams(),
            upcomingEventsData: { items: [makeEvent(1, day), makeEvent(2, 2 * day)] },
        }
        const target = buildReminderTargets(params).find(t => t.id === 'weekly-upcoming-events')
        expect(target!.body).toContain('2 upcoming grant events')
    })

    it('omits weekly upcoming-events reminder when list is empty', () => {
        const targets = buildReminderTargets(baseParams())
        expect(targets.find(t => t.id === 'weekly-upcoming-events')).toBeUndefined()
    })
})

describe(' weekly: active grants', () => {
    buildReminderTargets
    it('produces a weekly reminder when active windows are open', () => {
        const params = {
            ...baseParams(),
            activeWindowsData: { result: { items: [makeWindow(1, 5 * 24 * 60 * 60 * 1000)] } },
        }
        const target = buildReminderTargets(params).find(t => t.id === 'weekly-active-grants')
        expect(target).toBeDefined()
        expect(target!.weeklyKey).toBe('active-grants')
    })

    it('omits weekly active-grants reminder when all windows are closed', () => {
        const params = {
            ...baseParams(),
            activeWindowsData: { result: { items: [makeWindow(1, -1000)] } },
        }
        expect(buildReminderTargets(params).find(t => t.id === 'weekly-active-grants')).toBeUndefined()
    })
})

describe(' weekly: pending tasks', () => {
    buildReminderTargets
    it('produces a weekly reminder when pending tasks exist', () => {
        const params = {
            ...baseParams(),
            pendingTasksData: { items: [{ id: 1 }, { id: 2 }] },
        }
        const target = buildReminderTargets(params).find(t => t.id === 'weekly-pending-tasks')
        expect(target).toBeDefined()
        expect(target!.weeklyKey).toBe('pending-tasks')
        expect(target!.body).toContain('2 pending tasks')
    })

    it('uses singular form for one task', () => {
        const params = { ...baseParams(), pendingTasksData: { items: [{ id: 1 }] } }
        const target = buildReminderTargets(params).find(t => t.id === 'weekly-pending-tasks')
        expect(target!.body).toContain('1 pending task')
        expect(target!.body).not.toContain('tasks')
    })

    it('omits weekly reminder when there are no pending tasks', () => {
        expect(buildReminderTargets(baseParams()).find(t => t.id === 'weekly-pending-tasks')).toBeUndefined()
    })
})

describe(' weekly: registered DG applications', () => {
    buildReminderTargets
    it('produces a weekly reminder for registered apps with open deadline', () => {
        const params = {
            ...baseParams(),
            orgProjectsData: { items: [makeProject(1, 'Registered', 5 * 24 * 60 * 60 * 1000)] },
        }
        const target = buildReminderTargets(params).find(t => t.id === 'weekly-registered-dg-apps')
        expect(target).toBeDefined()
        expect(target!.weeklyKey).toBe('registered-dg-apps')
        expect(target!.body).toContain('1 registered discretionary')
    })

    it('is case-insensitive when matching registered status', () => {
        const params = {
            ...baseParams(),
            orgProjectsData: { items: [makeProject(1, 'REGISTERED', 5 * 24 * 60 * 60 * 1000)] },
        }
        expect(buildReminderTargets(params).find(t => t.id === 'weekly-registered-dg-apps')).toBeDefined()
    })

    it('skips registered apps where the deadline has passed', () => {
        const params = {
            ...baseParams(),
            orgProjectsData: { items: [makeProject(1, 'Registered', -1000)] },
        }
        expect(buildReminderTargets(params).find(t => t.id === 'weekly-registered-dg-apps')).toBeUndefined()
    })

    it('includes registered apps with no endDate (open-ended)', () => {
        const params = {
            ...baseParams(),
            orgProjectsData: { items: [makeProject(1, 'Registered', null)] },
        }
        expect(buildReminderTargets(params).find(t => t.id === 'weekly-registered-dg-apps')).toBeDefined()
    })

    it('skips non-registered apps', () => {
        const params = {
            ...baseParams(),
            orgProjectsData: { items: [makeProject(1, 'Submitted', 5 * 24 * 60 * 60 * 1000)] },
        }
        expect(buildReminderTargets(params).find(t => t.id === 'weekly-registered-dg-apps')).toBeUndefined()
    })

    it('aggregates multiple registered apps into a single reminder', () => {
        const day = 24 * 60 * 60 * 1000
        const params = {
            ...baseParams(),
            orgProjectsData: {
                items: [
                    makeProject(1, 'Registered', day),
                    makeProject(2, 'Registered', 2 * day),
                ],
            },
        }
        const matches = buildReminderTargets(params).filter(t => t.id === 'weekly-registered-dg-apps')
        expect(matches).toHaveLength(1)
        expect(matches[0].body).toContain('2 registered discretionary')
    })
})

describe(' no data / nullish', () => {
    buildReminderTargets
    it('returns empty array when all data is undefined', () => {
        const targets = buildReminderTargets({
            activeWindowsData: undefined,
            upcomingEventsData: undefined,
            pendingTasksData: undefined,
            orgProjectsData: undefined,
            now: NOW,
        })
        expect(targets).toEqual([])
    })

    it('returns empty array when items arrays are empty', () => {
        expect(buildReminderTargets(baseParams())).toEqual([])
    })
})

// ─── Tests: weekly reminder service ────────────────────────────────────────────

describe('shouldSendWeeklyReminder / markWeeklyReminderSent', () => {
    beforeEach(() => {
        Object.keys(store).forEach(k => delete store[k])
    })

    it('returns true when no record exists for the key', async () => {
        expect(await shouldSendWeeklyReminder('test-key')).toBe(true)
    })

    it('returns false immediately after marking as sent', async () => {
        await markWeeklyReminderSent('test-key')
        expect(await shouldSendWeeklyReminder('test-key')).toBe(false)
    })

    it('returns true when last-sent timestamp is older than 7 days', async () => {
        const oldTimestamp = Date.now() - WEEK_MS - 1000
        const meta = JSON.stringify({ 'test-key': oldTimestamp })
        store['@chieta/reminders/weekly'] = meta
        expect(await shouldSendWeeklyReminder('test-key')).toBe(true)
    })

    it('returns false when last-sent was 6 days ago', async () => {
        const recentTimestamp = Date.now() - (WEEK_MS - 60_000)
        store['@chieta/reminders/weekly'] = JSON.stringify({ 'test-key': recentTimestamp })
        expect(await shouldSendWeeklyReminder('test-key')).toBe(false)
    })

    it('different keys are independent', async () => {
        await markWeeklyReminderSent('key-a')
        expect(await shouldSendWeeklyReminder('key-a')).toBe(false)
        expect(await shouldSendWeeklyReminder('key-b')).toBe(true)
    })
})
