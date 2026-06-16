import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../providers/sensor_provider.dart';
import '../widgets/vital_card.dart';
import '../widgets/chart_widget.dart';
import '../widgets/bottom_nav.dart';

class HomeScreen extends StatefulWidget {
  const HomeScreen({Key? key}) : super(key: key);

  @override
  State<HomeScreen> createState() => _HomeScreenState();
}

class _HomeScreenState extends State<HomeScreen> {
  int _selectedIndex = 0;

  @override
  void initState() {
    super.initState();
    WidgetsBinding.instance.addPostFrameCallback((_) {
      context.read<SensorProvider>().startMonitoring();
    });
  }

  @override
  void dispose() {
    context.read<SensorProvider>().stopMonitoring();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('Health Monitor'),
        centerTitle: true,
        elevation: 0,
        actions: [
          IconButton(
            icon: const Icon(Icons.settings),
            onPressed: () {
              // Navigate to settings
            },
          ),
        ],
      ),
      body: Consumer<SensorProvider>(
        builder: (context, sensorProvider, _) {
          return SingleChildScrollView(
            padding: const EdgeInsets.all(16),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                // Status Card
                _buildStatusCard(sensorProvider),
                const SizedBox(height: 20),

                // Vital Signs
                const Text(
                  'Vital Signs',
                  style: TextStyle(
                    fontSize: 18,
                    fontWeight: FontWeight.bold,
                  ),
                ),
                const SizedBox(height: 12),
                _buildVitalSignsGrid(sensorProvider),
                const SizedBox(height: 20),

                // Charts
                const Text(
                  'Trends',
                  style: TextStyle(
                    fontSize: 18,
                    fontWeight: FontWeight.bold,
                  ),
                ),
                const SizedBox(height: 12),
                ChartWidget(
                  title: 'Heart Rate',
                  data: sensorProvider.heartRateHistory,
                  color: Colors.red,
                ),
                const SizedBox(height: 16),
                ChartWidget(
                  title: 'Blood Oxygen',
                  data: sensorProvider.spO2History,
                  color: Colors.blue,
                ),
              ],
            ),
          );
        },
      ),
      bottomNavigationBar: BottomNav(
        selectedIndex: _selectedIndex,
        onTap: (index) {
          setState(() {
            _selectedIndex = index;
          });
        },
      ),
    );
  }

  Widget _buildStatusCard(SensorProvider provider) {
    return Container(
      padding: const EdgeInsets.all(16),
      decoration: BoxDecoration(
        gradient: LinearGradient(
          colors: [Colors.blue[400]!, Colors.blue[600]!],
          begin: Alignment.topLeft,
          end: Alignment.bottomRight,
        ),
        borderRadius: BorderRadius.circular(12),
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          const Text(
            'Device Status',
            style: TextStyle(
              color: Colors.white,
              fontSize: 14,
              fontWeight: FontWeight.w500,
            ),
          ),
          const SizedBox(height: 8),
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              Chip(
                backgroundColor: Colors.white.withOpacity(0.2),
                label: Text(
                  provider.isConnected ? '🟢 Connected' : '🔴 Offline',
                  style: const TextStyle(color: Colors.white),
                ),
              ),
              Text(
                'Last update: ${provider.lastUpdateTime}',
                style: const TextStyle(
                  color: Colors.white70,
                  fontSize: 12,
                ),
              ),
            ],
          ),
        ],
      ),
    );
  }

  Widget _buildVitalSignsGrid(SensorProvider provider) {
    return GridView.count(
      crossAxisCount: 2,
      shrinkWrap: true,
      physics: const NeverScrollableScrollPhysics(),
      crossAxisSpacing: 12,
      mainAxisSpacing: 12,
      children: [
        VitalCard(
          icon: Icons.favorite,
          title: 'Heart Rate',
          value: '${provider.currentData.heartRate}',
          unit: 'BPM',
          color: Colors.red,
          status: _getHRStatus(provider.currentData.heartRate),
        ),
        VitalCard(
          icon: Icons.cloud,
          title: 'Blood Oxygen',
          value: '${provider.currentData.spO2}',
          unit: '%',
          color: Colors.blue,
          status: _getSpO2Status(provider.currentData.spO2),
        ),
        VitalCard(
          icon: Icons.thermostat,
          title: 'Temperature',
          value: '${provider.currentData.temperature.toStringAsFixed(1)}',
          unit: '°C',
          color: Colors.orange,
          status: _getTempStatus(provider.currentData.temperature),
        ),
        VitalCard(
          icon: Icons.directions_walk,
          title: 'Activity',
          value: provider.currentData.activity,
          unit: '',
          color: Colors.green,
          status: 'Normal',
        ),
      ],
    );
  }

  String _getHRStatus(int hr) {
    if (hr < 60) return 'Low';
    if (hr > 100) return 'High';
    return 'Normal';
  }

  String _getSpO2Status(int spo2) {
    if (spo2 < 95) return 'Low';
    return 'Normal';
  }

  String _getTempStatus(double temp) {
    if (temp < 36.5) return 'Low';
    if (temp > 37.5) return 'High';
    return 'Normal';
  }
}
