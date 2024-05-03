# Overview

This app has two screens, one to view and manage a list of stored URLs and the other is to scan QR codes.

For scanning QR code, this app uses `expo-camera` which also handles permission checks and requesting camera permissions for us.

For storing list of scanned URLs in a persistent storage, the app uses `react-native-mmkv`. The main advantage is being able
to observe updates of stored values and persist updates where they happen.
