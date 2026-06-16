# Web Interface Guide

## Overview
The web dashboard provides real-time monitoring and control of the ESP32 medical device.

## Features

### Real-time Monitoring
- **Heart Rate**: Live BPM with trend visualization
- **Blood Oxygen (SpO2)**: Percentage with status indicator
- **Temperature**: Real-time body temperature monitoring
- **Activity**: Motion and activity classification

### Data Visualization
- **Line Charts**: 24-hour historical trends
- **Activity Distribution**: Pie chart of activities
- **Statistics Dashboard**: Daily min/max/average values

### Device Controls
- Device selection (multiple devices supported)
- Refresh rate adjustment
- Calibration control
- Device reset functionality

### Alerts & Notifications
- Configurable alert thresholds
- Heart rate alerts
- SpO2 alerts
- Temperature alerts
- Fall detection alerts
- Alert history log

### Data Export
- CSV export for spreadsheet analysis
- JSON export for API integration

## Installation

### Prerequisites
- Web server (Apache, Nginx, Node.js, or similar)
- Modern web browser (Chrome, Firefox, Safari, Edge)
- Internet connection

### Setup

1. **Copy Web Files**
   ```bash
   cp -r web/ /var/www/html/medical-device/
   ```

2. **Configure ESP32 WebServer**
   Add to your ESP32 firmware:
   ```cpp
   #include <WiFi.h>
   #include <WebServer.h>
   
   WebServer server(80);
   
   void handleData() {
     String json = "{";
     json += "\"heartRate\":" + String(sensorData.heartRate) + ",";
     json += "\"spO2\":" + String(sensorData.spO2) + ",";
     json += "\"temperature\":" + String(sensorData.temperature) + ",";
     json += "\"activity\":\"" + getActivityName(sensorData.lastActivity) + "\"";
     json += "}";
     server.send(200, "application/json", json);
   }
   
   void setup() {
     // ... other setup code ...
     server.on("/api/data", handleData);
     server.begin();
   }
   ```

3. **Start Web Server**
   - For Node.js:
     ```bash
     npx http-server web/ -p 8000
     ```
   - For Python:
     ```bash
     cd web/
     python -m http.server 8000
     ```

4. **Access Dashboard**
   - Open browser to: `http://localhost:8000`
   - Or: `http://192.168.1.100:8000`

## Usage

### Starting Monitoring
1. Click "Start Monitoring" button
2. Select desired device from dropdown
3. Dashboard will refresh every 2 seconds (adjustable)

### Configuring Alerts
1. Check/uncheck alert types in left panel
2. Alerts will appear in "Recent Alerts" section
3. Export data with alerts if needed

### Exporting Data
1. Click "Export CSV" for spreadsheet format
2. Click "Export JSON" for API integration
3. Files will download automatically

### Device Calibration
1. Keep device steady on flat surface
2. Click "Calibrate" button
3. Wait for calibration to complete (shown in modal)
4. Device will restart

## API Endpoints

The ESP32 should expose these endpoints:

### GET /api/data
```json
{
  "heartRate": 72,
  "spO2": 98,
  "temperature": 36.8,
  "activity": "Walking"
}
```

### POST /api/calibrate
```json
{
  "status": "calibration_started"
}
```

### POST /api/reset
```json
{
  "status": "device_reset"
}
```

## Customization

### Changing Colors
Edit `styles.css`:
```css
.header {
    background: white;
    /* ... */
}

/* Change primary color */
.btn-primary {
    background: #your-color;
}
```

### Adjusting Chart Ranges
Edit `app.js` in `setupCharts()` function:
```javascript
scales: {
    y: {
        beginAtZero: true,
        max: 200,  // Change max HR value
    }
}
```

### Adding New Metrics
1. Add HTML card in `index.html`
2. Add JavaScript update function in `app.js`
3. Style with CSS in `styles.css`

## Browser Compatibility

| Browser | Version | Support |
|---------|---------|----------|
| Chrome  | 90+     | ✅ Full |
| Firefox | 88+     | ✅ Full |
| Safari  | 14+     | ✅ Full |
| Edge    | 90+     | ✅ Full |

## Performance Optimization

- Charts update every 2 seconds
- Data limited to last 60 points
- Responsive design for mobile devices
- Lazy loading for charts
- Cached static assets

## Security Considerations

⚠️ **Important for Production:**

1. **Enable HTTPS**
   ```cpp
   // In ESP32 code
   #include <ssl.h>
   // Configure SSL certificates
   ```

2. **Authentication**
   - Implement username/password
   - Use JWT tokens
   - API key validation

3. **CORS Headers**
   ```cpp
   server.sendHeader("Access-Control-Allow-Origin", "*");
   server.sendHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
   ```

4. **Rate Limiting**
   - Limit API requests per IP
   - Implement request throttling

## Troubleshooting

### Device Not Found
- Check ESP32 IP address
- Verify WiFi connection
- Check firewall rules

### No Data Displayed
- Verify API endpoint is responding
- Check browser console for errors
- Enable mock data for testing

### Slow Performance
- Increase refresh interval
- Reduce number of data points
- Enable browser caching

## Advanced Features

### Mobile App Integration
- Use REST API for mobile apps
- Send alerts via push notifications
- Cloud data synchronization

### Data Analytics
- Export to database (SQL, MongoDB)
- Machine learning for anomaly detection
- Predictive health analytics

### Multi-Device Management
- Dashboard for all devices
- Comparative analytics
- Centralized configuration
