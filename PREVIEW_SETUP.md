# 🚀 Preview Release Summary

**App:** Chieta  
**Version:** 1.0.0-preview.1  
**Date:** February 8, 2026  
**Status:** Ready for Preview

---

## ✅ Preparation Complete

Your app has been set up for a public preview release via Expo. Here's what was prepared:

### Files Created/Updated

1. **[PREVIEW_RELEASE.md](PREVIEW_RELEASE.md)** ⭐ START HERE
   - Complete checklist (15+ items)
   - Step-by-step build instructions
   - Distribution options explained
   - Troubleshooting guide
   - Rollout phases

2. **[RELEASE_NOTES.md](RELEASE_NOTES.md)**
   - Template for documenting changes
   - Known issues section
   - Feedback collection framework
   - Fill in your specific features and improvements

3. **[eas.json](eas.json)**
   - EAS (Expo Application Services) configuration
   - Set up for Android APK preview builds
   - Ready for iOS simulator/device builds
   - Use as-is or customize for your needs

4. **[.env.example](.env.example)**
   - Environment variables template
   - Copy to `.env` and fill in your values
   - Includes API endpoints, feature flags, etc.

5. **[setup-preview.sh](setup-preview.sh)**
   - One-command setup script
   - Run: `bash setup-preview.sh`
   - Installs dependencies and verifies EAS CLI

6. **[package.json](package.json)** (Updated)
   - Added preview build scripts
   - Version bumped to 1.0.0-preview.1

---

## 🎯 Quick Start (3 Steps)

### Step 1: Setup Environment

```bash
# Copy environment template
cp .env.example .env

# Edit .env with your actual API endpoints
# (Update EXPO_PUBLIC_API_URL, etc.)

# Configure telemetry (optional but recommended)
EXPO_PUBLIC_SENTRY_DSN=your_sentry_dsn
EXPO_PUBLIC_SENTRY_ENV=preview
EXPO_PUBLIC_SENTRY_TRACES=0.2
```

### Step 2: Fill in Release Notes

```bash
# Edit RELEASE_NOTES.md
# Add your features, improvements, and known issues
```

### Step 3: Build & Share

```bash
# For Android (recommended first)
npm run build:android

# For iOS
npm run build:ios

# Check build status
npm run build:status
```

That's it! You'll get a shareable link for testers.

---

## 🤖 Automated Store Deployments

- Workflow: `.github/workflows/store-deploy.yml`
- Trigger: pushes to `main` / `release/*` touching app files, or manual **Run workflow**.
- Actions: run tests, `eas build --profile production`, then `eas submit --latest` to Google Play Internal Testing and App Store Connect.

### Configure once

1. Generate an Expo token (`eas token:create`) and add GitHub secret `EXPO_TOKEN`.
2. Create a Google Play service account JSON and store it as `GOOGLE_SERVICE_ACCOUNT_JSON`.
3. Create an App Store Connect API key and store:
   - `APP_STORE_CONNECT_API_KEY` (contents of the `.p8` file)
   - `APP_STORE_CONNECT_KEY_ID`
   - `APP_STORE_CONNECT_KEY_ISSUER_ID`

After secrets exist, every qualifying push deploys automatically. Use the optional `build-profile` input on manual runs to deploy `preview` builds without editing YAML.

---

## 📋 Before You Build - Final Checklist

- [ ] Read [PREVIEW_RELEASE.md](PREVIEW_RELEASE.md) completely
- [ ] Update [RELEASE_NOTES.md](RELEASE_NOTES.md) with your changes
- [ ] Configure [.env](.env) file (copy from .env.example)
- [ ] Verify API endpoints in [endpoints.txt](endpoints.txt)
- [ ] Test app locally: `npm run android` or `npm run ios`
- [ ] Commit changes: `git add . && git commit -m "chore: prepare v1.0.0-preview.1"`
- [ ] Have EAS CLI installed: `npm install -g eas-cli`
- [ ] Logged into Expo: `eas login`
- [ ] Log collector endpoint configured (or confirm telemetry is intentionally disabled)
- [ ] Review [RELIABILITY_GUIDE.md](RELIABILITY_GUIDE.md) for the latest regression steps

---

## 🚀 Build Commands Available

```bash
# Development
npm start                  # Start dev server
npm run android           # Run on Android emulator
npm run ios              # Run on iOS simulator
npm run web              # Run in web browser

# Preview Builds (for distribution)
npm run build:android    # Build APK for Android preview
npm run build:ios        # Build for iOS preview
npm run build:all        # Build both platforms
npm run build:status     # Check build status

# Cleanup
npm run prebuild:clean   # Clean Expo prebuild cache
```

---

## 📱 Distribution Flow

```
Your Code
    ↓
Build with EAS (npm run build:android)
    ↓
Get Shareable Link/QR Code
    ↓
Share with Testers
    ↓
Testers Install & Test
    ↓
Collect Feedback
    ↓
Fix Issues (repeat steps 1-4)
    ↓
Release v1.0.0 (when ready)
```

---

## 🔑 Key Features Tested

Ensure these are working before releasing:

- [ ] User authentication (login/logout)
- [ ] Navigation (tab switching, page navigation)
- [ ] API calls (network requests)
- [ ] File operations (upload/download)
- [ ] PDF generation
- [ ] Notifications (push notifications)
- [ ] Data persistence (Redux/AsyncStorage)
- [ ] Error handling and loading states

---

## 📞 Tester Instructions

Share this with your testers:

1. **Get the App**
   - Open the link we send you
   - Scan the QR code with phone camera
   - Or use Expo Go app

2. **Install**
   - For Android: Download APK and install
   - For iOS: Open link in Expo Go or TestFlight

3. **Test & Report**
   - Go through app features
   - Report bugs with steps to reproduce
   - Suggest improvements
   - Rate experience

4. **Share Feedback**
   - Email: [your contact]
   - Form: [your form link]
   - Time: Expected testing duration

---

## ⚡ Performance Tips

- First EAS build takes 5-10 minutes
- Subsequent builds: 2-3 minutes (if no native changes)
- Android APK builds faster than iOS
- Consider building overnight for large teams

---

## 🆘 Need Help?

### Common Issues

**"eas command not found"**

```bash
npm install -g eas-cli
```

**"Build failed"**

- Check [PREVIEW_RELEASE.md](PREVIEW_RELEASE.md) Troubleshooting section
- Clear cache: `expo prebuild --clean`
- Check API endpoints in [endpoints.txt](endpoints.txt)

**"Can't install on device"**

- Verify test device is authorized
- Check internet connection during install
- Try again with newer build

---

## 📅 Next Milestones

| Phase | Timeline | Action |
|-------|----------|--------|
| **Preview** | Now | Build & share with testers |
| **Feedback** | Days 1-3 | Monitor for critical issues |
| **Iterate** | Days 4-7 | Fix bugs, polish features |
| **Public Preview** | Week 2 | Broader feedback (optional) |
| **Release v1.0.0** | Week 3+ | Full launch|

---

## 📚 Documentation Links

- [PREVIEW_RELEASE.md](PREVIEW_RELEASE.md) - Complete guide with all details
- [RELEASE_NOTES.md](RELEASE_NOTES.md) - What's new in this preview
- [endpoints.txt](endpoints.txt) - API configuration
- [AUTHENTICATION_GUIDE.ts](AUTHENTICATION_GUIDE.ts) - Auth setup details
- [app.json](app.json) - Expo app configuration
- [eas.json](eas.json) - Build service configuration

---

## 🎉 You're Ready

Your app is now prepared for preview release. The hardest part is done.

**Next step:** Follow the Quick Start section above to begin building.

Good luck with your preview! 🚀

---

*Generated: February 8, 2026*  
*Version: 1.0.0-preview.1*
