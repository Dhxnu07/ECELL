# Flutter Mobile App Setup

## Installation Instructions

### Prerequisites
- Flutter SDK 3.0+
- Dart SDK
- Android Studio or Xcode
- iOS 12+ or Android 6+

### Step 1: Install Flutter

```bash
# Download Flutter from flutter.dev
# Extract to a directory
# Add to PATH

echo 'export PATH="$PATH:/path/to/flutter/bin"' >> ~/.bashrc

# Verify installation
flutter doctor
```

### Step 2: Project Setup

```bash
# Navigate to mobile directory
cd mobile/

# Get dependencies
flutter pub get

# Generate Hive adapters (optional)
flutter pub run build_runner build
```

### Step 3: Run on Android

```bash
# Connect Android device or start emulator
flutter devices

# Run app
flutter run

# Or build APK
flutter build apk --release
```

### Step 4: Run on iOS

```bash
# Install iOS dependencies
cd ios/
pod install
cd ..

# Run on simulator
flutter run -d ios

# Or build IPA
flutter build ios --release
```

## Project Structure

```
mobile/
├── lib/
│   ├── main.dart                 # App entry point
│   ├── screens/
│   │   ├── splash_screen.dart
│   │   ├── home_screen.dart
│   │   ├── analytics_screen.dart
│   │   ├── alerts_screen.dart
│   │   └── settings_screen.dart
│   ├── widgets/
│   │   ├── vital_card.dart
│   │   ├── chart_widget.dart
│   │   └── bottom_nav.dart
│   ├── providers/
│   │   ├── sensor_provider.dart
│   │   └── device_provider.dart
│   ├── services/
│   │   ├── notification_service.dart
│   │   ├── storage_service.dart
│   │   └── api_service.dart
│   └── models/
│       └── sensor_data.dart
├── pubspec.yaml              # Dependencies
└── README.md
```

## Features

### ✅ Implemented
- Real-time sensor data monitoring
- Beautiful vital signs cards
- Line charts with historical data
- Device connection status
- Mock data for testing
- Local storage support
- Notification system
- Bottom navigation

### 🔄 To Implement
- Analytics screen with advanced charts
- Alerts management
- Settings screen
- Data export (PDF, CSV)
- Offline mode
- Bluetooth connectivity
- Cloud sync
- User authentication

## Configuration

### Change Device IP

Edit in `sensor_provider.dart`:
```dart
String _deviceIP = '192.168.1.100';  // Change this
```

Or dynamically:
```dart
final provider = context.read<SensorProvider>();
provider.setDeviceIP('192.168.1.105');
```

## API Endpoints Expected

The app expects these endpoints from ESP32:

```
GET http://device-ip:80/api/data
{
  "heartRate": 72,
  "spO2": 98,
  "temperature": 36.8,
  "activity": "Walking"
}
```

## Building & Distribution

### Android Release
```bash
flutter build apk --release
# APK location: build/app/outputs/flutter-apk/app-release.apk

# Or build App Bundle for Play Store
flutter build appbundle --release
# AAB location: build/app/outputs/bundle/release/app-release.aab
```

### iOS Release
```bash
flutter build ios --release
# Archive in Xcode and upload to App Store
```

## Testing

```bash
# Run tests
flutter test

# Run specific test
flutter test test/providers/sensor_provider_test.dart

# Code coverage
flutter test --coverage
```

## Debugging

```bash
# Enable debug logging
flutter run -v

# Use DevTools
flutter pub global activate devtools
devtools
```

## Troubleshooting

### App crashes on startup
- Clear app cache: `flutter clean`
- Reinstall: `flutter pub get`
- Rebuild: `flutter run`

### Device not detected
- Check USB drivers installed
- Enable developer mode on device
- Try: `flutter devices`

### Slow performance
- Use release mode: `flutter run --release`
- Profile app: `flutter run --profile`
- Check DevTools Performance tab

## License

MIT License
