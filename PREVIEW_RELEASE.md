# Chieta Preview Release (v1.0.0-preview.1)

## Pre-Release Checklist

### Code & Testing

- [ ] All critical features tested on physical devices (iOS & Android)
- [ ] No console errors or warnings in production build
- [ ] Network requests tested with actual API endpoints
- [ ] Notifications tested and working
- [ ] Document upload/download functionality verified
- [ ] PDF generation and sharing tested
- [ ] Theme/dark mode working correctly
- [ ] All user flows completed without crashes

### Configuration & Secrets

- [ ] API endpoints in [endpoints.txt](endpoints.txt) are correct for preview
- [ ] No hardcoded secrets or credentials in code
- [ ] Redux store initialized with proper defaults
- [ ] Async storage mock data removed if present
- [ ] Environment-specific configs in place

### Build & Performance  

- [ ] App builds without errors: `expo build:android` and `expo build:ios`
- [ ] App starts within acceptable time
- [ ] Memory usage reasonable (no obvious leaks)
- [ ] Bundle size acceptable

### App Store Metadata

- [ ] App icon and splash screen visually correct
- [ ] App name: "Chieta" ✓
- [ ] Version: "1.0.0-preview.1" ✓
- [ ] Description/tagline prepared
- [ ] Screenshots prepared (if needed for TestFlight)
- [ ] Privacy policy linked/included
- [ ] Terms of service prepared

### Documentation

- [ ] RELEASE_NOTES.md completed with new features
- [ ] Known issues documented
- [ ] Tester feedback form/channel ready
- [ ] Support contact information prepared

---

## Distribution Setup

### Option 1: Expo Preview (Recommended for Quick Sharing)

#### Prerequisites

```bash
# Install EAS CLI if not already installed
npm install -g eas-cli

# Login to your Expo account
eas login
```

#### Initial Setup (One Time)

```bash
# Initialize EAS in your project
eas build:configure

# This creates eas.json with build configurations
# Choose iOS and/or Android when prompted
```

#### Verify eas.json Created

Check that [eas.json](eas.json) exists in your project root with configurations. ✓ Already configured and validated.

#### Build for Preview

```bash
# Build an APK for Android (faster, direct install)
eas build --platform android --profile preview

# Or build for iOS (requires Xcode team setup)
eas build --platform ios --profile preview

# Or build both
eas build --platform all --profile preview
```

**Note:** First builds take ~5-10 minutes. Subsequent builds are faster if no native code changes.

#### Share Preview App

After the build completes:

1. You'll get a unique link from EAS
2. Share this link directly with testers
3. Testers can install via phone camera, QR code scanner, or direct link
4. No App Store approval needed

---

### Option 2: TestFlight (iOS)

#### Prerequisites

- [ ] Apple Developer account ($99/year)
- [ ] App signed with team certificate
- [ ] Testers have Apple IDs

#### Steps

```bash
# Setup Apple credentials
eas credentials

# Build for TestFlight
eas build --platform ios --profile preview

# Automatically uploaded if configured in eas.json
```

---

### Option 3: Google Play Internal Testing (Android)

#### Prerequisites  

- [ ] Google Play Developer account ($25 one-time)
- [ ] App signed with upload key
- [ ] Create app in Google Play Console

#### Steps

```bash
# Setup Google Play credentials
eas credentials

# Build for Play Store
eas build --platform android --profile preview

# Upload to Google Play Console > Internal Testing
```

## Automated Store Deployment (CI/CD)

GitHub Actions now handles store submissions via `.github/workflows/store-deploy.yml`. Pushes to `main` or `release/*` that touch app files automatically run tests, build with the `production` EAS profile, and submit the artifacts to Google Play Internal Testing and App Store Connect.

### Required GitHub Action secrets

1. `EXPO_TOKEN` – Expo account token (`eas token:create`) with access to this project.
2. `GOOGLE_SERVICE_ACCOUNT_JSON` – The raw JSON from your Google Play service account (Internal track).
3. `APP_STORE_CONNECT_API_KEY` – Contents of the App Store Connect `.p8` key.
4. `APP_STORE_CONNECT_KEY_ID` – Key ID for the `.p8`.
5. `APP_STORE_CONNECT_KEY_ISSUER_ID` – Issuer ID tied to the key.

Secrets are materialized as temporary files during the workflow and removed before the job finishes.

### Workflow stages

1. Install dependencies and run `npm run test`.
2. Authenticate to Expo/EAS using `EXPO_TOKEN`.
3. For each platform: `eas build --profile production --wait`.
4. Immediately `eas submit --latest` to the appropriate store (`internal` track on Google Play, App Store Connect via API key).

### Manual triggers / overrides

- Navigate to **Actions → Deploy mobile apps → Run workflow** to deploy on demand.
- Optional input `build-profile` lets you reuse the same workflow for preview/internal builds.
- Monitor the workflow logs to grab the submission URLs produced by EAS.

### Failure recovery

- Fix the offending step and re-run only that job, or click **Retry all jobs**.
- Use `eas build:list` / `eas submit --latest` locally if the CI environment is unavailable.
- Keep Expo credentials up to date (`eas credentials`) so the pipeline can remain fully non-interactive.

---

## Reliability & QA Playbook

See [RELIABILITY_GUIDE.md](RELIABILITY_GUIDE.md) for the full stability audit, telemetry configuration, offline queue behaviour, and regression scripts.

### Telemetry
- Populate `EXPO_PUBLIC_LOG_ENDPOINT` before building so runtime logs flow to the organisation’s on-prem collector.
- The logger always prints locally and posts JSON payloads to the server; failures to reach the collector never block the UI.

### Offline queue
- Network mutations that fail automatically serialize into AsyncStorage and replay when connectivity returns.
- Register additional executors in `src/core/services/reliability.ts` for any new queue types.

### Regression checklist (per release)
1. `npm run test`
2. Execute the smoke script on low-end Android + current iOS hardware (see Reliability Guide).
3. Toggle Airplane Mode, trigger a notification, reconnect, confirm it syncs server-side.
4. Run the **Deploy mobile apps** workflow and ensure both store submissions succeed.

Log any deviations before tagging.

---

## Pre-Release Steps

### 1. Commit Version Change

```bash
git add app.json package.json
git commit -m "chore: bump version to 1.0.0-preview.1"
git push
```

### 2. Create Release Notes

Create [RELEASE_NOTES.md](RELEASE_NOTES.md) with:

- New features in this preview
- Known issues
- Feedback requests
- Deprecation notices

### 3. Clean Build Environment

```bash
# Clear Expo cache
rm -rf node_modules .expo
npm install

# Clear cache for fresh build
expo prebuild --clean
```

### 4. Test Build Locally

```bash
# Test on Android
expo start --android

# Test on iOS  
expo start --ios

# Test web (if needed)
expo start --web
```

### 5. Run Type Check & Linting

```bash
# Check for TypeScript errors
tsc --noEmit

# Fix any issues before building
```

---

## Building & Testing

### Local Testing Before EAS Build

```bash
# Start dev server
npm start

# In another terminal, test on specific platform
expo run:android
# or
expo run:ios
```

### EAS Build Status

```bash
# Check build progress
eas build:list

# Monitor specific build
eas build --wait
```

### Testing Preview Release

1. **Install the app** from the provided link/QR code
2. **Test core flows:**
   - Login/Authentication
   - Navigation between tabs
   - Form submissions
   - File uploads/downloads
   - PDF generation
   - Notifications

3. **Report issues** with:
   - Device model and OS version
   - Steps to reproduce
   - Screenshots/videos
   - Error messages

---

## Rollout Plan

### Phase 1: Internal Testing (Days 1-3)

- Share with 5-10 internal testers
- Monitor daily for critical issues
- Quick fixes if needed

### Phase 2: Extended Preview (Days 4-7)

- Expand to 50+ testers if stable
- Collect feature requests
- Document user feedback

### Phase 3: Public Preview (Optional)

- Share with target user group
- Gather market feedback
- Prepare for 1.0.0 release

---

## Troubleshooting

### Build Issues

```bash
# Clear all build cache
eas build:clean

# Rebuild with verbose output
eas build --platform android --verbose
```

### Network Issues Installing APK

- Ensure phone allows installation from unknown sources
- Use Expo Go app as fallback
- Try alternative distribution method

### Certificate/Signing Issues

```bash
# Reset credentials
eas credentials --platform ios --clear
eas credentials

# Then rebuild
```

---

## Post-Release

### Monitor Feedback

- [ ] Create feedback form/channel
- [ ] Confirm log collector endpoint reachable (or document intentional disablement)
- [ ] Monitor app performance metrics

### Issue Tracking

- [ ] Create GitHub Issues for reported bugs
- [ ] Prioritize critical vs. nice-to-have
- [ ] Plan hotfixes if needed

### Next Steps After Preview

- [ ] Collect all feedback
- [ ] Plan 1.0.0 final release
- [ ] Schedule launch date
- [ ] Prepare app store submissions

---

## Quick Reference

**Current Version:** 1.0.0-preview.1  
**App Name:** Chieta  
**Platforms:** iOS & Android  
**Distribution:** Expo Preview (EAS Builds)

**Essential Commands:**

```bash
eas build --platform android --profile preview
eas build:list
expo start --android
expo start --ios
```

**Contact & Support:**

- [AUTHENTICATION_GUIDE.ts](AUTHENTICATION_GUIDE.ts) - Auth implementation details
- Endpoints: [endpoints.txt](endpoints.txt)
