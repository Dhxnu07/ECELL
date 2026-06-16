import 'package:flutter/material.dart';
import 'package:http/http.dart' as http;
import 'dart:convert';
import '../models/sensor_data.dart';

class SensorProvider extends ChangeNotifier {
  SensorData _currentData = SensorData(
    heartRate: 0,
    spO2: 0,
    temperature: 0.0,
    activity: 'Idle',
  );

  final List<double> _heartRateHistory = [];
  final List<double> _spO2History = [];
  final List<double> _temperatureHistory = [];

  bool _isMonitoring = false;
  bool _isConnected = false;
  String _lastUpdateTime = 'Never';
  String _deviceIP = '192.168.1.100';

  // Getters
  SensorData get currentData => _currentData;
  List<double> get heartRateHistory => _heartRateHistory;
  List<double> get spO2History => _spO2History;
  List<double> get temperatureHistory => _temperatureHistory;
  bool get isConnected => _isConnected;
  String get lastUpdateTime => _lastUpdateTime;
  bool get isMonitoring => _isMonitoring;

  // Start monitoring
  Future<void> startMonitoring() async {
    _isMonitoring = true;
    notifyListeners();
    _fetchData();
  }

  // Stop monitoring
  void stopMonitoring() {
    _isMonitoring = false;
    notifyListeners();
  }

  // Set device IP
  void setDeviceIP(String ip) {
    _deviceIP = ip;
  }

  // Fetch sensor data from ESP32
  Future<void> _fetchData() async {
    if (!_isMonitoring) return;

    try {
      final response = await http
          .get(
            Uri.parse('http://$_deviceIP:80/api/data'),
          )
          .timeout(const Duration(seconds: 5));

      if (response.statusCode == 200) {
        final data = jsonDecode(response.body);
        _currentData = SensorData(
          heartRate: data['heartRate'] as int,
          spO2: data['spO2'] as int,
          temperature: (data['temperature'] as num).toDouble(),
          activity: data['activity'] as String,
        );
        _isConnected = true;
        _updateTime();
        _addToHistory();
      }
    } catch (e) {
      print('Error fetching data: $e');
      _isConnected = false;
      // Use mock data for demo
      _generateMockData();
    }

    notifyListeners();

    // Fetch again after 2 seconds
    if (_isMonitoring) {
      await Future.delayed(const Duration(seconds: 2));
      _fetchData();
    }
  }

  // Add data to history
  void _addToHistory() {
    _heartRateHistory.add(_currentData.heartRate.toDouble());
    _spO2History.add(_currentData.spO2.toDouble());
    _temperatureHistory.add(_currentData.temperature);

    // Keep only last 60 data points
    if (_heartRateHistory.length > 60) {
      _heartRateHistory.removeAt(0);
      _spO2History.removeAt(0);
      _temperatureHistory.removeAt(0);
    }
  }

  // Generate mock data for demo
  void _generateMockData() {
    _currentData = SensorData(
      heartRate: (60 + (40 * (0.5 - DateTime.now().second % 60 / 60))).toInt(),
      spO2: (96 + (DateTime.now().second % 5) - 2).toInt(),
      temperature: 36.8 + (DateTime.now().second % 10 - 5) / 10,
      activity: ['Idle', 'Walking', 'Running'][DateTime.now().second % 3],
    );
    _addToHistory();
  }

  // Update last update time
  void _updateTime() {
    final now = DateTime.now();
    _lastUpdateTime = '${now.hour}:${now.minute}:${now.second}';
  }
}
