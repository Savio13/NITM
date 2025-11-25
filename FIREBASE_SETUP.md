# Firebase Setup Guide for NITM App

## Step 1: Create Firebase Project

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Click **Create a project** or **Add project**
3. Project name: `NITM` (or your preferred name)
4. Disable Google Analytics (optional for now)
5. Click **Create project**

## Step 2: Register Android App

1. In Firebase Console, click **+Add app** and select **Android**
2. **Android package name**: `com.nitm.app` (or your package name)
3. **App nickname**: `NITM Android`
4. **SHA-1 certificate fingerprint** (optional but recommended):
   - Run: `cd mobile && flutter clean && flutter pub get`
   - For debug builds: `keytool -list -v -keystore ~/.android/debug.keystore -alias androiddebugkey -storepass android -keypass android`
   - Copy the SHA-1 hash
5. Download `google-services.json` and place it at: `mobile/android/app/google-services.json`

## Step 3: Register iOS App

1. In Firebase Console, click **+Add app** and select **iOS**
2. **iOS bundle ID**: `com.nitm.app` (or your bundle ID)
3. **App nickname**: `NITM iOS`
4. Download `GoogleService-Info.plist` and place it at: `mobile/ios/Runner/GoogleService-Info.plist`
5. In Xcode: Right-click `Runner` → Add Files → Select `GoogleService-Info.plist` → Add to Target: `Runner`

## Step 4: Enable Cloud Messaging

1. In Firebase Console, go to **Cloud Messaging** tab
2. Ensure **Enable** is shown (should be auto-enabled)
3. Copy **Server API Key** (you'll need this for backend notifications)

## Step 5: Backend Configuration

Add the Firebase Server API Key to your `.env` file:

```
FIREBASE_SERVER_KEY=YOUR_SERVER_API_KEY_HERE
```

## Step 6: Update Android Manifest (if needed)

The `firebase_messaging` plugin should auto-configure, but verify `android/app/build.gradle` has:

```gradle
dependencies {
    implementation 'com.google.firebase:firebase-messaging:23.2.0'
}
```

## Step 7: Test FCM Setup

1. Run the mobile app: `flutter run`
2. Check console output for FCM token
3. Send a test notification from Firebase Console → Cloud Messaging → Send your first message

---

## Troubleshooting

**Android**:
- If `google-services.json` not found: Ensure it's in `android/app/`
- Rebuild: `flutter clean && flutter pub get && flutter run`

**iOS**:
- If `GoogleService-Info.plist` not found in Xcode: Add it via Xcode → Target Runner → Build Phases → Copy Bundle Resources
- Pod issues: `cd ios && pod deintegrate && pod install && cd ..`

**Firebase Console**:
- If Cloud Messaging not appearing: Project may still be initializing; refresh or try again in 2 minutes

