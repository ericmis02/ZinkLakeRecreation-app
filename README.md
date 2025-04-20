# Welcome to your Expo app 👋

This is an [Expo](https://expo.dev) project created with [`create-expo-app`](https://www.npmjs.com/package/create-expo-app).

## Table of Contents
- [Get started](#get-started)
- [Development options](#development-options)
- [Project structure](#project-structure)
- [Troubleshooting](#troubleshooting)
- [Learn more](#learn-more)
- [Join the community](#join-the-community)

## Get started

1. Install dependencies

   ```bash
   npm install
   ```

2. Start the app

   ```bash
   npx expo start
   ```

## Development options

In the output, you'll find options to open the app in a:

- [Development build](https://docs.expo.dev/develop/development-builds/introduction/)
- [Android emulator](https://docs.expo.dev/workflow/android-studio-emulator/)
- [iOS simulator](https://docs.expo.dev/workflow/ios-simulator/)
- [Expo Go](https://expo.dev/go), a limited sandbox for trying out app development with Expo

You can start developing by editing the files inside the **app** directory. This project uses [file-based routing](https://docs.expo.dev/router/introduction).

## Project structure

When you're ready to start fresh, run:

```bash
npm run reset-project
```

This command will move the starter code to the **app-example** directory and create a blank **app** directory where you can start developing.

## Troubleshooting

### "There was an error running the requested app" in Expo Go (iOS)

If you encounter this error when trying to open your app in Expo Go:

1. **Switch to Tunnel Connection**:
   - In the Expo Developer Tools (usually at http://localhost:19002), change the connection type from "LAN" to "Tunnel".
   - Scan the QR code again after making this change.

2. **Check Network Connection**:
   - Ensure your device and development computer are connected to the same WiFi network.
   - Verify you have a stable internet connection.

3. **Update Expo Go**:
   - Make sure you have the latest version of Expo Go installed from the App Store.

4. **Check Firewall Settings**:
   - If you're on a corporate or restricted network, firewall settings might be blocking the connection.
   - Try using a different network or contact your network administrator.

5. **Clear Cache**:
   - Try clearing the cache:
     ```bash
     npx expo start --clear
     ```

6. **Check for Conflicting Packages**:
   - Some packages (like expo-dev-client) might cause issues with Expo Go.
   - Review recently installed packages.

7. **Rebuild the App**:
   - Try rebuilding the app from scratch:
     ```bash
     npx expo start --clear --no-dev --minify
     ```

### Metro Bundler Issues

If you're having issues with the Metro Bundler:

```bash
# Clear Metro bundler cache
npx react-native start --reset-cache
```

## Learn more

To learn more about developing your project with Expo, look at the following resources:

- [Expo documentation](https://docs.expo.dev/): Learn fundamentals, or go into advanced topics with our [guides](https://docs.expo.dev/guides).
- [Learn Expo tutorial](https://docs.expo.dev/tutorial/introduction/): Follow a step-by-step tutorial where you'll create a project that runs on Android, iOS, and the web.

## Join the community

Join our community of developers creating universal apps.

- [Expo on GitHub](https://github.com/expo/expo): View our open source platform and contribute.
- [Discord community](https://chat.expo.dev): Chat with Expo users and ask questions.
