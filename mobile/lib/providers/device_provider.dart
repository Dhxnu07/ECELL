import 'package:flutter/material.dart';

class DeviceProvider extends ChangeNotifier {
  String _deviceIP = '192.168.1.100';
  String _deviceName = 'Medical Device';
  bool _isCalibrating = false;
  List<String> _alerts = [];

  // Getters
  String get deviceIP => _deviceIP;
  String get deviceName => _deviceName;
  bool get isCalibrating => _isCalibrating;
  List<String> get alerts => _alerts;

  // Set device IP
  void setDeviceIP(String ip) {
    _deviceIP = ip;
    notifyListeners();
  }

  // Set device name
  void setDeviceName(String name) {
    _deviceName = name;
    notifyListeners();
  }

  // Calibrate device
  Future<void> calibrateDevice() async {
    _isCalibrating = true;
    notifyListeners();

    try {
      // Simulate calibration
      await Future.delayed(const Duration(seconds: 3));
      _alerts.add('✅ Device calibrated successfully');
    } catch (e) {
      _alerts.add('❌ Calibration failed: $e');
    }

    _isCalibrating = false;
    notifyListeners();
  }

  // Reset device
  Future<void> resetDevice() async {
    try {
      // Simulate reset
      await Future.delayed(const Duration(seconds: 1));
      _alerts.add('✅ Device reset successfully');
    } catch (e) {
      _alerts.add('❌ Reset failed: $e');
    }
    notifyListeners();
  }

  // Add alert
  void addAlert(String alert) {
    _alerts.insert(0, alert);
    if (_alerts.length > 20) {
      _alerts.removeLast();
    }
    notifyListeners();
  }

  // Clear alerts
  void clearAlerts() {
    _alerts.clear();
    notifyListeners();
  }
}
