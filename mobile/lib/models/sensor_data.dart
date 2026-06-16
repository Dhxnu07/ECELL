class SensorData {
  final int heartRate;
  final int spO2;
  final double temperature;
  final String activity;
  final DateTime timestamp;

  SensorData({
    required this.heartRate,
    required this.spO2,
    required this.temperature,
    required this.activity,
    DateTime? timestamp,
  }) : timestamp = timestamp ?? DateTime.now();

  // Convert to JSON
  Map<String, dynamic> toJson() {
    return {
      'heartRate': heartRate,
      'spO2': spO2,
      'temperature': temperature,
      'activity': activity,
      'timestamp': timestamp.toIso8601String(),
    };
  }

  // Create from JSON
  factory SensorData.fromJson(Map<String, dynamic> json) {
    return SensorData(
      heartRate: json['heartRate'] as int,
      spO2: json['spO2'] as int,
      temperature: (json['temperature'] as num).toDouble(),
      activity: json['activity'] as String,
      timestamp: DateTime.parse(json['timestamp'] as String),
    );
  }
}
