# Release Engineering & Deployment (RELEASE.md)

This document describes the release procedure, versioning scheme, signing workflows, and rollback strategies for Parichay.

---

## 1. Versioning & Release Checklist

Parichay follows [Semantic Versioning 2.0.0](https://semver.org/).
Every release must follow this sequence:

1. **Verify All Quality Gates**:
   ```bash
   npm run verify:all
   ```
2. **Update Version in Manifests**:
   - `package.json` (`"version": "x.y.z"`)
   - `metadata.json`
   - `android/app/build.gradle` (`versionCode`, `versionName`)
   - `ios/App/App.xcodeproj` (`CURRENT_PROJECT_VERSION`, `MARKETING_VERSION`)
3. **Update `CHANGELOG.md`**:
   - Move entries from `[Unreleased]` into the new version header with ISO date.
4. **Synchronize Native Codebases**:
   ```bash
   npm run cap:sync
   ```
5. **Git Tagging**:
   ```bash
   git add .
   git commit -m "chore(release): v1.0.1"
   git tag -a v1.0.1 -m "Release v1.0.1"
   ```

---

## 2. Building Signed Android Releases (.aab)

```bash
# 1. Clean and build web assets
npm run build

# 2. Sync to Android project
npx cap sync android

# 3. Enter Android project and build Release App Bundle
cd android
./gradlew bundleRelease
```

The resulting bundle is output to:
`android/app/build/outputs/bundle/release/app-release.aab`

### Signing with Keystore
Configure your keystore parameters in `android/keystore.properties` (never commit keystore files):
```properties
storeFile=../parichay-release.keystore
keyAlias=parichay
storePassword=***
keyPassword=***
```

---

## 3. Building Signed iOS Releases (IPA / App Store)

```bash
# 1. Sync to iOS project
npm run cap:sync

# 2. Open Xcode
npx cap open ios
```
1. Select the **App** target in Xcode.
2. Under **Signing & Capabilities**, select your Team and configure Automatic Signing.
3. Select **Product &rarr; Archive**.
4. In the Organizer window, choose **Distribute App &rarr; App Store Connect**.
5. Upload to TestFlight for smoke validation on physical iPhones.

---

## 4. Rollback Strategies

Because Parichay does not use remote cloud servers, rollback behavior depends on distribution:
1. **Web / PWA**:
   - Re-deploy the previous Git release commit to the static host.
   - The Service Worker will automatically detect the updated hash, purge stale assets, and activate the stable bundle on next load.
2. **Google Play Store**:
   - Use Google Play Console **Release Dashboard &rarr; Halt Rollout** or roll back by promoting the previous APK/AAB to production.
3. **Apple App Store**:
   - Re-submit the prior stable build number in App Store Connect.

---

*Designed & developed by [Omkar Kardile](https://omkardile.is-a.dev/)*
