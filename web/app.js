// ===== Global Variables =====
let chartInstances = {};
let sensorData = {
    heartRate: [],
    spO2: [],
    temperature: [],
    timestamp: []
};

let monitoring = false;
let refreshInterval = 2000;
let currentDevice = '192.168.1.100';

// ===== Initialization =====
document.addEventListener('DOMContentLoaded', function() {
    initializeDashboard();
    setupCharts();
    startMonitoring();
});

function initializeDashboard() {
    console.log('Initializing Medical Device Dashboard...');
    updateTime();
    setInterval(updateTime, 1000);
}

function setupCharts() {
    // Heart Rate Chart
    const hrCtx = document.getElementById('hr-chart').getContext('2d');
    chartInstances.hr = new Chart(hrCtx, {
        type: 'line',
        data: {
            labels: [],
            datasets: [{
                label: 'Heart Rate (BPM)',
                data: [],
                borderColor: '#ff6b6b',
                backgroundColor: 'rgba(255, 107, 107, 0.1)',
                borderWidth: 2,
                tension: 0.4,
                fill: true,
                pointRadius: 3,
                pointBackgroundColor: '#ff6b6b'
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: true,
            plugins: {
                legend: { display: false }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    max: 200,
                    ticks: { font: { size: 10 } }
                },
                x: {
                    ticks: { font: { size: 10 } }
                }
            }
        }
    });

    // SpO2 Chart
    const spo2Ctx = document.getElementById('spo2-chart').getContext('2d');
    chartInstances.spo2 = new Chart(spo2Ctx, {
        type: 'line',
        data: {
            labels: [],
            datasets: [{
                label: 'SpO2 (%)',
                data: [],
                borderColor: '#4ecdc4',
                backgroundColor: 'rgba(78, 205, 196, 0.1)',
                borderWidth: 2,
                tension: 0.4,
                fill: true,
                pointRadius: 3,
                pointBackgroundColor: '#4ecdc4'
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: true,
            plugins: {
                legend: { display: false }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    max: 105,
                    min: 80,
                    ticks: { font: { size: 10 } }
                },
                x: {
                    ticks: { font: { size: 10 } }
                }
            }
        }
    });

    // Temperature Chart
    const tempCtx = document.getElementById('temp-chart').getContext('2d');
    chartInstances.temp = new Chart(tempCtx, {
        type: 'line',
        data: {
            labels: [],
            datasets: [{
                label: 'Temperature (°C)',
                data: [],
                borderColor: '#ffa500',
                backgroundColor: 'rgba(255, 165, 0, 0.1)',
                borderWidth: 2,
                tension: 0.4,
                fill: true,
                pointRadius: 3,
                pointBackgroundColor: '#ffa500'
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: true,
            plugins: {
                legend: { display: false }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    max: 40,
                    min: 35,
                    ticks: { font: { size: 10 } }
                },
                x: {
                    ticks: { font: { size: 10 } }
                }
            }
        }
    });

    // Activity Distribution Chart
    const activityCtx = document.getElementById('activity-chart').getContext('2d');
    chartInstances.activity = new Chart(activityCtx, {
        type: 'doughnut',
        data: {
            labels: ['Idle', 'Walking', 'Running', 'Stairs'],
            datasets: [{
                data: [30, 40, 20, 10],
                backgroundColor: [
                    '#667eea',
                    '#00d4aa',
                    '#ff6b6b',
                    '#ffa500'
                ]
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: true,
            plugins: {
                legend: {
                    position: 'bottom'
                }
            }
        }
    });
}

// ===== Monitoring Functions =====
function startMonitoring() {
    monitoring = true;
    document.querySelector('.btn-primary').disabled = true;
    console.log('Starting monitoring...');
    fetchSensorData();
}

function stopMonitoring() {
    monitoring = false;
    document.querySelector('.btn-primary').disabled = false;
    console.log('Stopping monitoring...');
}

async function fetchSensorData() {
    if (!monitoring) return;

    try {
        // Simulate API call to ESP32
        const response = await fetch(`http://${currentDevice}:80/api/data`);
        
        if (response.ok) {
            const data = await response.json();
            updateDashboard(data);
            updateDeviceStatus('online');
        } else {
            updateDeviceStatus('offline');
        }
    } catch (error) {
        console.error('Error fetching sensor data:', error);
        updateDeviceStatus('offline');
        // Use mock data for demonstration
        updateDashboardWithMockData();
    }

    if (monitoring) {
        setTimeout(fetchSensorData, refreshInterval);
    }
}

function updateDashboard(data) {
    // Update vital signs
    document.getElementById('heart-rate').textContent = data.heartRate + ' BPM';
    document.getElementById('spo2-value').textContent = data.spO2 + ' %';
    document.getElementById('temp-value').textContent = data.temperature.toFixed(1) + ' °C';
    document.getElementById('activity-value').textContent = data.activity;

    // Update status indicators
    updateStatus('hr', data.heartRate);
    updateStatus('spo2', data.spO2);
    updateStatus('temp', data.temperature);

    // Store data for charts
    const now = new Date().toLocaleTimeString();
    sensorData.heartRate.push(data.heartRate);
    sensorData.spO2.push(data.spO2);
    sensorData.temperature.push(data.temperature);
    sensorData.timestamp.push(now);

    // Keep only last 60 data points
    if (sensorData.heartRate.length > 60) {
        sensorData.heartRate.shift();
        sensorData.spO2.shift();
        sensorData.temperature.shift();
        sensorData.timestamp.shift();
    }

    updateCharts();
    updateStatistics();
}

function updateDashboardWithMockData() {
    // Generate mock data for demonstration
    const mockData = {
        heartRate: Math.floor(Math.random() * 40) + 60,
        spO2: Math.floor(Math.random() * 8) + 96,
        temperature: (Math.random() * 2) + 36.5,
        activity: ['Idle', 'Walking', 'Running'][Math.floor(Math.random() * 3)]
    };
    updateDashboard(mockData);
}

function updateStatus(type, value) {
    const statusElement = document.getElementById(`${type}-status`);
    let status = 'Normal';
    let color = '#00d4aa';

    if (type === 'hr') {
        if (value < 60) status = 'Low';
        else if (value > 100) status = 'Elevated';
    } else if (type === 'spo2') {
        if (value < 95) {
            status = 'Low';
            color = '#ff6b6b';
        }
    } else if (type === 'temp') {
        if (value < 36.5) {
            status = 'Low';
            color = '#4ecdc4';
        } else if (value > 37.5) {
            status = 'High';
            color = '#ff6b6b';
        }
    }

    statusElement.textContent = status;
    statusElement.style.color = color;
}

function updateCharts() {
    // Update HR Chart
    chartInstances.hr.data.labels = sensorData.timestamp;
    chartInstances.hr.data.datasets[0].data = sensorData.heartRate;
    chartInstances.hr.update('none');

    // Update SpO2 Chart
    chartInstances.spo2.data.labels = sensorData.timestamp;
    chartInstances.spo2.data.datasets[0].data = sensorData.spO2;
    chartInstances.spo2.update('none');

    // Update Temperature Chart
    chartInstances.temp.data.labels = sensorData.timestamp;
    chartInstances.temp.data.datasets[0].data = sensorData.temperature;
    chartInstances.temp.update('none');
}

function updateStatistics() {
    if (sensorData.heartRate.length === 0) return;

    // Calculate statistics
    const avgHR = Math.floor(sensorData.heartRate.reduce((a, b) => a + b) / sensorData.heartRate.length);
    const maxHR = Math.max(...sensorData.heartRate);
    const minHR = Math.min(...sensorData.heartRate);
    const avgSpo2 = Math.floor(sensorData.spO2.reduce((a, b) => a + b) / sensorData.spO2.length);

    // Update DOM
    document.getElementById('avg-hr').textContent = avgHR + ' BPM';
    document.getElementById('max-hr').textContent = maxHR + ' BPM';
    document.getElementById('min-hr').textContent = minHR + ' BPM';
    document.getElementById('avg-spo2').textContent = avgSpo2 + ' %';

    // Calculate HRV (Heart Rate Variability)
    const hrv = calculateHRV(sensorData.heartRate);
    document.getElementById('hrv').textContent = hrv.toFixed(0) + ' ms';
}

function calculateHRV(heartRateArray) {
    if (heartRateArray.length < 2) return 0;
    
    let sum = 0;
    for (let i = 1; i < heartRateArray.length; i++) {
        sum += Math.abs(heartRateArray[i] - heartRateArray[i - 1]);
    }
    return sum / (heartRateArray.length - 1);
}

// ===== Control Functions =====
function selectDevice() {
    currentDevice = document.getElementById('device-select').value;
    console.log('Selected device:', currentDevice);
}

function updateRefreshRate() {
    const rate = parseInt(document.getElementById('refresh-rate').value);
    refreshInterval = rate * 1000;
    console.log('Refresh rate updated to:', refreshInterval, 'ms');
}

function calibrateDevice() {
    alert('Calibrating device... Please keep it steady and wait for completion.');
    console.log('Calibration initiated');
    // TODO: Send calibration command to device
}

function resetDevice() {
    if (confirm('Are you sure you want to reset the device?')) {
        alert('Device reset initiated...');
        console.log('Device reset');
        // TODO: Send reset command to device
    }
}

// ===== Data Export Functions =====
function exportCSV() {
    const csv = 'Timestamp,Heart Rate (BPM),SpO2 (%),Temperature (°C)\n';
    let content = csv;

    for (let i = 0; i < sensorData.timestamp.length; i++) {
        content += `${sensorData.timestamp[i]},${sensorData.heartRate[i]},${sensorData.spO2[i]},${sensorData.temperature[i]}\n`;
    }

    downloadFile(content, 'medical_data.csv', 'text/csv');
}

function exportJSON() {
    const data = {
        exportDate: new Date().toISOString(),
        device: currentDevice,
        data: sensorData
    };

    const content = JSON.stringify(data, null, 2);
    downloadFile(content, 'medical_data.json', 'application/json');
}

function downloadFile(content, filename, type) {
    const blob = new Blob([content], { type: type });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    link.click();
    URL.revokeObjectURL(url);
}

// ===== Utility Functions =====
function updateDeviceStatus(status) {
    const statusElement = document.getElementById('device-status');
    if (status === 'online') {
        statusElement.textContent = '🟢 Online';
        statusElement.className = 'status-online';
    } else {
        statusElement.textContent = '🔴 Offline';
        statusElement.className = 'status-offline';
    }
}

function updateTime() {
    const now = new Date().toLocaleTimeString();
    document.getElementById('last-update').textContent = now;
}
