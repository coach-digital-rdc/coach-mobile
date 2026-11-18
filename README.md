# Coach Digital – Mobile

Field application (React Native 0.72, local SQLite database, synchronisation with the API).

## Setup dev

  - Requirements: Node.js 18+, npm; Android Studio, SDK and JDK 17 for Android; Xcode and CocoaPods for iOS. Watchman is recommended on macOS
  - Tested on 18/11/2026 with Node.js 24, JDK 17, Gradle 8.0.1 and an Android 14 emulator (API 34)
  - Copy `.env.example` to `.env`:
    - `API_URL`: API URL with the country prefix. On the Android emulator use `10.0.2.2` to reach the computer; on a physical phone use the computer's IP address on the same Wi-Fi
    - `COUNTRY`: lowercase, same value as in the backend
    - `LOGIN_MODE`: `OTP` or `PASSWORD`
  - Run `npm install`
  - Terminal 1: `npm start` (Metro, port 8081; add `-- --reset-cache` to clear the cache). Without Watchman, Metro may stop with `EMFILE: too many open files, watch`: start it with `CI=true npm start` (no file watching, restart Metro after each change) or install Watchman (`brew install watchman`)
  - Terminal 2: `npm run android`, or for iOS `cd ios && pod install && cd ..` then `npm run ios`
  - In development the OTP code is printed in the backend log
  - Standalone APK, with the JavaScript bundled in (no Metro needed): `cd android && CI=true ./gradlew assembleRelease`, then `adb install -r app/build/outputs/apk/release/app-release.apk`. It is signed with the debug key: for distribution, sign it with the project's own key
