# Coach Digital – Mobile

Field application (React Native 0.72, local SQLite database, synchronisation with the API).

## Setup dev

  - Requirements: Node.js 18+, npm; Android Studio, SDK and JDK for Android; Xcode and CocoaPods for iOS
  - Copy `.env.example` to `.env`:
    - `API_URL`: API URL with the country prefix. On the Android emulator use `10.0.2.2` to reach the computer; on a physical phone use the computer's IP address on the same Wi-Fi
    - `COUNTRY`: lowercase, same value as in the backend
    - `LOGIN_MODE`: `OTP` or `PASSWORD`
  - Run `npm install`
  - Terminal 1: `npm start` (Metro, port 8081; add `-- --reset-cache` to clear the cache)
  - Terminal 2: `npm run android`, or for iOS `cd ios && pod install && cd ..` then `npm run ios`
  - In development the OTP code is printed in the backend log
  - If the APK is installed but the launch command fails (`adb shell am start`, code 255), open the app manually on the device
