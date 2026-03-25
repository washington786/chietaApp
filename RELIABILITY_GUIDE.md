# Reliability & Release Guardrails

This document captures the stability audit outcomes, new observability/telemetry plumbing, offline resilience patterns, and the regression plan required for store-ready builds.

## 1. Stability Audit Summary

| Area | Findings | Fix |
| --- | --- | --- |
| **Networking** | Fetch failures were swallowed, no retries on transient 5xx/timeout responses. | `api.ts` now retries 2x with exponential backoff and logs failures via the shared logger. 401s still trigger silent refresh. |
| **Notifications** | `autoSaveNotification` would drop reminders if the device was offline at save time. | Added offline queue + replay handlers; failed writes are serialized to AsyncStorage and replayed when connectivity resumes. |
| **Global errors** | Uncaught exceptions crashed the app without visibility. | Added a dedicated `AppErrorBoundary` + crash fallback so we log failures, keep the UI responsive, and allow restart without force-closing. |
| **Async storage** | Reminder metadata persistence already guarded; no change needed. | — |

Pending risks are tracked via GitHub issues. Anything that cannot be automated (e.g., long-running uploads) is listed in the open questions section at the bottom.

## 2. Observability & Crash Reporting

### On-Prem log collector
- Configuration: set `EXPO_PUBLIC_LOG_ENDPOINT` to the HTTPS endpoint hosted on the organisation’s logging stack.
- Error boundary: `App.tsx` wraps the tree in `AppErrorBoundary`, which feeds all uncaught exceptions through `logger.error` and shows the `CrashFallback` UI so users can safely retry without a full restart.
- Logging helper: `src/utils/logger.ts` now posts JSON payloads (`level`, `message`, `context`, `error`, `timestamp`) to the collector while still printing to the native console for local debugging.

**Setup**
1. Provide the collector endpoint in `.env` via `EXPO_PUBLIC_LOG_ENDPOINT`.
2. (Optional) Configure any server-side routing/auth headers if needed; the client posts anonymously so PII never leaves the device unless included in the message/context payload.

## 3. Offline & Resilience Strategy

- `src/core/services/offlineQueue.ts` handles queued mutations with AsyncStorage persistence and Expo-Network awareness.
- `initializeReliabilityLayer()` (auto-run on app load) registers executors for each queued request type.
- Current handler: `notification` writes; extend by registering additional executors (e.g., document uploads) in `src/core/services/reliability.ts`.
- Queue items retry up to 5 times with capped backoff; failures bubble to the logger so operations receives visibility when a request is permanently dropped.

### Usage
```ts
await enqueueOfflineRequest('notification', payload)
```
The queue automatically flushes when network connectivity resumes; no extra wiring required inside UI code.

## 4. QA & Regression Plan

### Automated
- Vitest suites now cover auth flows, logout, combined notifications, and the offline queue.
- Add new specs alongside Redux slices or services when touching user-facing logic.
- Use `npm run test` inside CI (already enforced by the deployment workflow).

### Manual / Device Matrix
| Device tier | Android | iOS | Notes |
| --- | --- | --- | --- |
| Low-end (Android Go / <2GB) | ✅ | — | Validate offline queue replay and disk usage. |
| Mid-tier (Pixel 5 / iPhone 12) | ✅ | ✅ | Exercise push + local notifications, document uploads. |
| Tablet | ✅ | ✅ | Ensure responsive layouts for forms/grids. |

**Smoke script**
1. Login, register, forgot password + OTP flows.
2. Link/de-link organisation, upload/download a document.
3. Trigger notifications (server + local reminder) and mark as read.
4. Toggle offline: submit notification, re-enable network, confirm it syncs.

Document defects with screenshots + the exported logs from the on-prem collector (or from device logs if offline).

## 5. Release Governance

- CI workflow `.github/workflows/store-deploy.yml` now enforces tests, EAS builds, and store submissions.
- Secrets required: `EXPO_TOKEN`, `GOOGLE_SERVICE_ACCOUNT_JSON`, `APP_STORE_CONNECT_API_KEY`, `APP_STORE_CONNECT_KEY_ID`, `APP_STORE_CONNECT_KEY_ISSUER_ID`.
- PREVIEW_RELEASE/SETUP docs reference this guide; keep them in sync when adding new telemetry or queues.

## 6. Open Questions / Future Work

- Background upload queue for large media (pending API constraints).
- Device coverage for accessibility features (screen readers, high-contrast themes).
- Automated Detox/E2E runs on release branches (blocked on CI minutes).

Until those are addressed, include them in release notes so stakeholders understand the remaining risk.*** End Patch
