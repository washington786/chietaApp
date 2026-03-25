# Notifications architecture audit

## Overview
This document captures the current state of the notification system and the gaps blocking a production-ready rollout for organisational users. The goal is to ensure a cohesive experience across local reminders, push notifications, and the in-app notification inbox.

## Existing building blocks
- **Expo utilities** (`src/core/utils/notifications.ts`): configures the notification handler, Android channel, permission request helper, Expo push token retrieval, a generic `scheduleNotification` helper, and a listener factory. At present these helpers are only imported by the push notification hook, so the scheduling API and listener go unused.
- **Push setup hook** (`src/hooks/notifications/usePushNotifications.ts`): requests permission on mount, fetches the Expo push token, and registers it via `registerPushToken` when a `user.id` exists. The hook returns loading state, the token, and permission flags but consumers (currently only `HomeScreen`) ignore failures apart from logging toasts.
- **Redux slice** (`src/store/slice/NotificationSlice.ts`): persists `AppNotification` items locally via Redux Persist. Only a few screens dispatch `saveNotification`, and nothing reads from this slice, so the stored reminders never surface in UI.
- **API surfaces** (`src/store/api/api.ts`): exposes `createNotification`, `getNotificationsByUser`, `markNotificationAsRead`, and `registerPushToken`. `getNotificationsByUser` normalises server data but only covers backend-originating “system” notifications.
- **UI and navigation**:  
  - `HomeHeader` shows a badge fed by `NewHome`, which counts unread items from `getNotificationsByUser` only.  
  - `NotificationsPage` renders a toggle between “Reminders” and “System” but both sections are populated solely with server data, so local reminders never appear.  
  - `LinkOrgPage` dispatches `saveNotification` for local events yet does not sync them and users have no way to access them.

## Gaps and risks
1. **Local reminder scheduling is unused** – `scheduleNotification` is never invoked, so time-based reminders (grant deadlines, pending tasks) do not exist.
2. **Notification store is orphaned** – Local reminders saved via Redux are invisible because no selector or UI consumes the state.
3. **No push listener** – Incoming push taps are not routed to navigation or persisted to the inbox, so users lose context when interacting with push alerts.
4. **Token lifecycle blind spots** – The push setup hook runs only on `HomeScreen` mount; if a user never visits that screen or revokes permission later, we have no retry/backoff mechanism.
5. **Server/local divergence** – Local reminders are not written back via `createNotification`, preventing multi-device parity and making badge counts inaccurate.
6. **Release verification missing** – There are no automated tests covering notification helpers, and we have not run an Expo production build with notifications enabled to validate entitlements.

## Enhancements introduced
- **NotificationProvider** now wraps the app, centralising permission handling, push token registration, listener wiring, and exposing status via context/hooks.
- **Reminder scheduler** consumes discretionary windows, pending tasks, and upcoming events to schedule Expo local notifications, persist reminders, and optionally sync them via `createNotification`.
- **Combined inbox feed** merges server notifications with local reminders (`useCombinedNotifications`), dedupes by `reminderId`, and powers both the Notifications page and home badge.
- **Metadata persistence** in `core/services/notifications.ts` ensures reminders are scheduled once per timestamp, and new unit tests cover the feed-merging behaviour.

## Next steps
- Monitor reminder scheduling telemetry (success/failure) and consider surfacing scheduling diagnostics in-app.
- Wire push payload taps to deep links so users land on the relevant screen automatically.
- Expand automated coverage to the scheduler metadata helpers and AsyncStorage persistence.
