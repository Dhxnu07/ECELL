# ESP32 Medical Device - Complete Wiring Diagram

## 📌 Pin Configuration Overview

```
ESP32 DevKit Pinout:

                    USB
                     |
        ┌────────────┴────────────┐
        │   ESP32 DEVKIT V1       │
        │                          │
   GND  │  ⚫                 ⚫  │  3.3V
   3.3V │  ⚫                 ⚫  │  EN
   5V   │  ⚫                 ⚫  │  SVP
   D14  │  ⚫                 ⚫  │  SVN
   D12  │  ⚫                 ⚫  │  D0
   D13  │  ⚫                 ⚫  │  D1
   D15  │  ⚫                 ⚫  │  GND
   D2   │  ⚫                 ⚫  │  D3
   D4   │  ⚫                 ⚫  │  D18
   5V   │  ⚫                 ⚫  │  D19
   18   │  ⚫                 ⚫  │  D21 (SDA)
   19   │  ⚫                 ⚫  │  D22 (SCL)
   23   │  ⚫                 ⚫  │  RXD0
   5V   │  ⚫                 ⚫  │  TXD0
   GND  │  ⚫                 ⚫  │  GND
```

## 🔌 Component Connections

### **I2C Bus (All Sensors Share)**
```
┌─────────────────────────────────────┐
│         I2C Configuration           │
├─────────────────────────────────────┤
│ SDA: GPIO 21                        │
│ SCL: GPIO 22                        │
│ I2C Speed: 100-400 kHz              │
│ Voltage: 3.3V                       │
└─────────────────────────────────────┘
```

### **Power Distribution**
```
        ┌───────────────────┐
        │   ESP32           │
        │ 3.3V Output       │
        └────────┬──────────┘
                 │
        ┌────────┴────────────┬──────────┬──────────┐
        │                     │          │          │
        ▼                     ▼          ▼          ▼
    OLED VCC            MAX30100 VCC  MPU6050 VCC  [Other Devices]
    (3.3V)              (3.3V)        (3.3V)
```

---

## 📐 Detailed Wiring Diagram

### **1️⃣ OLED Display (SSD1306) - I2C Connection**

```
┌──────────────────────────────────────────────────┐
│               OLED SSD1306 128x64                │
│  ┌──────────────────────────────────────────┐   │
│  │  VCC  GND  SCL  SDA  ......             │   │
│  └──┬───┬────┬────┬──────────────────────┘   │
│     │   │    │    │                           │
│     │   │    │    └─────────────────────┐     │
│     │   │    └──────────────────────┐   │     │
│     │   │                           │   │     │
└─────┼───┼───────────────────────────┼───┼─────┘
      │   │                           │   │
      │   │                    ┌──────┘   │
      │   │                    │          │
  ┌───▼───▼────────────────────▼──────────▼───┐
  │         ESP32 DevKit                       │
  │                                            │
  │  3.3V ───────────────────────► VCC        │
  │  GND  ───────────────────────► GND        │
  │  GPIO 21 (SDA) ───────────────► SDA       │
  │  GPIO 22 (SCL) ───────────────► SCL       │
  │                                            │
  └────────────────────────────────────────────┘

   I2C Address: 0x3C (Default)
   Max Current: 20 mA
```

### **2️⃣ MAX30100/MAX30102 (Heart Rate & SpO2)**

```
┌──────────────────────────────────────────────────┐
│            MAX30100 / MAX30102                   │
│  ┌──────────────────────────────────────────┐   │
│  │ VCC  GND  SDA  SCL  INT  ......         │   │
│  └──┬───┬────┬────┬────┬──────────────────┘   │
│     │   │    │    │    │                      │
└─────┼───┼────┼────┼────┼──────────────────────┘
      │   │    │    │    │
      │   │    │    │    └─► INT (Optional)
      │   │    │    │
  ┌───▼───▼────▼────▼──────────────────────┐
  │         ESP32 DevKit                    │
  │                                         │
  │  3.3V ────────────────────► VCC        │
  │  GND  ────────────────────► GND        │
  │  GPIO 21 (SDA) ───────────► SDA        │
  │  GPIO 22 (SCL) ───────────► SCL        │
  │  GPIO 35 (Optional) ──────► INT        │
  │                                         │
  └─────────────────────────────────────────┘

   I2C Address: 0x57
   Sampling Rate: 100 Hz
   Current: 8 mA typical
```

### **3️⃣ MPU6050 (6-Axis IMU)**

```
┌──────────────────────────────────────────────────┐
│              MPU6050 GY-521                      │
│  ┌──────────────────────────────────────────┐   │
│  │ VCC  GND  SCL  SDA  AD0  INT  ......    │   │
│  └──┬───┬────┬────┬────┬───┬────┬───────┘   │
│     │   │    │    │    │   │    │            │
└─────┼───┼────┼────┼────┼───┼────┼────────────┘
      │   │    │    │    │   │    │
      │   │    │    │    │   │    └─► INT (Optional)
      │   │    │    │    │   │
      │   │    │    │    │   └─────► GND (to set I2C 0x68)
      │   │    │    │    │
  ┌───▼───▼────▼────▼────┼─────────────────────┐
  │         ESP32 DevKit  │                    │
  │                       │                    │
  │  3.3V ────────────────┴─────► VCC          │
  │  GND  ────────────────────► GND            │
  │  GPIO 21 (SDA) ───────────► SDA            │
  │  GPIO 22 (SCL) ───────────► SCL            │
  │  GPIO 34 (Optional) ──────► INT            │
  │                                            │
  └────────────────────────────────────────────┘

   I2C Address: 0x68 (AD0=GND) or 0x69 (AD0=3.3V)
   Accel Range: ±8g (configurable)
   Gyro Range: ±500°/s (configurable)
   Current: 3.9 mA typical
```

---

## 🔗 Complete Breadboard Layout

```
Breadboard Top View (Half-size):

┌─────────────────────────────────────────────────────────────┐
│ ESP32                    OLED          MAX30100   MPU6050   │
│                                                             │
│  3.3V ●                  VCC           VCC        VCC       │
│   │   ├─────────────────────┬───────────┬──────────┤       │
│   │   │                     │           │          │        │
│  GND ●                  GND             GND        GND      │
│   │   ├─────────────────────┼───────────┼──────────┤       │
│   │   │                     │           │          │        │
│  21  ● (SDA)─────────────SDA┼───────SDA┼──────SDA │        │
│   │   │                     │           │          │        │
│  22  ● (SCL)─────────────SCL┼───────SCL┼──────SCL │        │
│   │   │                     │           │          │        │
│  35  ● (INT Optional)        │ INT      │ INT      │        │
│   │   │                     │           │          │        │
│      ├─ GND ────────────────┼───────────┼────────AD0       │
│      │                     │           │                   │
│      ├─ 5V ────────────────┼───────────┼──────────┤        │
│      │                     │           │          │        │
│      └─ USB ───────────────┘           │          │        │
│                                         │          │        │
└─────────────────────────────────────────┴──────────┴────────┘

✅ All sensors on I2C bus
✅ Shared power and ground
✅ Optional interrupt pins
```

---

## 📋 Pin Summary Table

| Component | Signal | ESP32 Pin | Type | Notes |
|-----------|--------|-----------|------|-------|
| **OLED** | VCC | 3.3V | Power | 20mA max |
| | GND | GND | Ground | Common |
| | SDA | GPIO 21 | I2C | Pull-up built-in |
| | SCL | GPIO 22 | I2C | Pull-up built-in |
| **MAX30100** | VCC | 3.3V | Power | 8mA typical |
| | GND | GND | Ground | Common |
| | SDA | GPIO 21 | I2C | Address 0x57 |
| | SCL | GPIO 22 | I2C | Addr 0x57 |
| | INT | GPIO 35 | Input | Optional |
| **MPU6050** | VCC | 3.3V | Power | 3.9mA typical |
| | GND | GND | Ground | Common |
| | SDA | GPIO 21 | I2C | Address 0x68 |
| | SCL | GPIO 22 | I2C | Addr 0x68 |
| | AD0 | GND | Select | Sets I2C addr |
| | INT | GPIO 34 | Input | Optional |

---

## 🔧 Component Specifications

### **ESP32-WROOM-32**
```
┌─────────────────────────────────┐
│ Microcontroller Specs           │
├─────────────────────────────────┤
│ Clock Speed: 240 MHz            │
│ RAM: 520 KB                     │
│ Flash: 4 MB                     │
│ GPIO Pins: 28 usable            │
│ I2C: 2 (I2C0, I2C1)            │
│ SPI: 4                          │
│ ADC: 2x 12-bit                  │
│ DAC: 2x 8-bit                   │
│ WiFi: 802.11 b/g/n             │
│ Bluetooth: 4.2 (BLE)            │
│ Voltage: 3.3V                   │
│ Current: 80mA typical           │
└─────────────────────────────────┘
```

### **SSD1306 OLED Display**
```
┌─────────────────────────────────┐
│ Display Specs                   │
├─────────────────────────────────┤
│ Size: 128x64 pixels             │
│ Interface: I2C/SPI              │
│ I2C Address: 0x3C or 0x3D       │
│ Voltage: 3.3V - 5V              │
│ Current: 20 mA typical          │
│ Response time: < 10 µs           │
│ Color: Monochrome (White/Blue)  │
│ Viewing angle: 160°             │
│ Lifetime: 100,000 hours         │
└─────────────────────────────────┘
```

### **MAX30100 Pulse Oximeter**
```
┌─────────────────────────────────┐
│ Sensor Specs                    │
├─────────────────────────────────┤
│ Function: Heart Rate + SpO2     │
│ Interface: I2C                  │
│ I2C Address: 0x57               │
│ Sampling Rate: 100 Hz           │
│ Voltage: 3.3V                   │
│ Current: 8 mA typical           │
│ LED Wavelength: 660nm + 880nm   │
│ Accuracy HR: ±5 BPM             │
│ Accuracy SpO2: ±2%              │
│ Range: HR 30-240 BPM            │
│ Range: SpO2 70-100%             │
└─────────────────────────────────┘
```

### **MPU6050 IMU**
```
┌─────────────────────────────────┐
│ Sensor Specs                    │
├─────────────────────────────────┤
│ Type: 6-Axis (Accel + Gyro)    │
│ Interface: I2C                  │
│ I2C Address: 0x68 or 0x69       │
│ Accel Range: ±2/4/8/16g         │
│ Gyro Range: ±250/500/1000/2000°/s │
│ Voltage: 3.3V - 5V              │
│ Current: 3.9 mA typical         │
│ Temperature Sensor: Built-in    │
│ Temp Range: -40 to 85°C         │
│ Accuracy: ±3% (Accel)           │
│ Accuracy: ±2% (Gyro)            │
└─────────────────────────────────┘
```

---

## 🛠️ Assembly Instructions

### **Step 1: Prepare Breadboard**
```
1. Place ESP32 on left side of breadboard
2. Connect power rails:
   - 3.3V rail (top positive)
   - GND rail (bottom negative)
3. Leave middle section empty for sensors
```

### **Step 2: Install I2C Pull-up Resistors (Optional)**
```
⚠️  Most modules have built-in pull-ups
   But if needed, add 4.7kΩ resistors:

   3.3V ──[4.7kΩ]──┬── GPIO 21 (SDA)
   3.3V ──[4.7kΩ]──┬── GPIO 22 (SCL)
```

### **Step 3: Connect OLED Display**
```
┌─────────┐
│  OLED   │
├─────────┤
│ VCC ────┼──► 3.3V rail
│ GND ────┼──► GND rail
│ SCL ────┼──► GPIO 22
│ SDA ────┼──► GPIO 21
└─────────┘
```

### **Step 4: Connect MAX30100**
```
┌──────────┐
│ MAX30100 │
├──────────┤
│ VCC ─────┼──► 3.3V rail
│ GND ─────┼──► GND rail
│ SCL ─────┼──► GPIO 22
│ SDA ─────┼──► GPIO 21
│ INT ─────┼──► GPIO 35 (optional)
└──────────┘
```

### **Step 5: Connect MPU6050**
```
┌──────────┐
│ MPU6050  │
├──────────┤
│ VCC ─────┼──► 3.3V rail
│ GND ─────┼──► GND rail (also AD0)
│ SCL ─────┼──► GPIO 22
│ SDA ─────┼──► GPIO 21
│ INT ─────┼──► GPIO 34 (optional)
└──────────┘
```

### **Step 6: Verify Connections**
```
✅ Check:
   - All sensors powered (3.3V)
   - All sensors grounded (GND)
   - SDA line connected to GPIO 21
   - SCL line connected to GPIO 22
   - No loose wires
   - No short circuits
```

---

## 🧪 Testing Connections

### **I2C Scanner Code**
```cpp
#include <Wire.h>

void setup() {
  Wire.begin(21, 22);  // SDA, SCL
  Serial.begin(115200);
  Serial.println("I2C Scanner");
}

void loop() {
  byte error, address;
  int nDevices = 0;
  
  Serial.println("Scanning for I2C devices...");
  
  for(address = 1; address < 127; address++) {
    Wire.beginTransmission(address);
    error = Wire.endTransmission();
    
    if (error == 0) {
      Serial.print("Device found at 0x");
      if (address < 16) Serial.print("0");
      Serial.println(address, HEX);
      nDevices++;
    }
  }
  
  if (nDevices == 0)
    Serial.println("No I2C devices found");
  
  delay(5000);
}
```

### **Expected Output**
```
Scanning for I2C devices...
Device found at 0x3C    ← OLED
Device found at 0x57    ← MAX30100
Device found at 0x68    ← MPU6050
```

---

## ⚡ Power Budget

```
Component          Typical Current    Max Current    Notes
───────────────────────────────────────────────────────────
ESP32              80 mA              160 mA         WiFi active
OLED               20 mA              30 mA          Full brightness
MAX30100           8 mA               12 mA          Sampling mode
MPU6050            3.9 mA             8 mA           Active mode
───────────────────────────────────────────────────────────
TOTAL              ~111 mA            ~210 mA        Peak usage
```

### **Power Supply Recommendation**
- USB Power: 500 mA (Sufficient)
- 3.3V Regulator: 1A or higher
- Battery: 3000+ mAh for portable use

---

## 🚨 Troubleshooting

### **Device Not Detected**
```
❌ Problem: No I2C devices found
✅ Solutions:
   1. Check SDA/SCL connections (GPIO 21/22)
   2. Verify 3.3V power supply
   3. Check GND connections
   4. Add pull-up resistors if needed
   5. Reduce I2C clock speed to 100 kHz
```

### **Sensor Readings Incorrect**
```
❌ Problem: Wrong or fluctuating values
✅ Solutions:
   1. Calibrate sensors (see CALIBRATION.md)
   2. Check sensor alignment (MPU6050)
   3. Verify I2C address correct
   4. Check for electromagnetic interference
   5. Move away from WiFi devices
```

### **OLED Display Not Showing**
```
❌ Problem: Blank display
✅ Solutions:
   1. Check I2C address (0x3C or 0x3D)
   2. Verify display contrast setting
   3. Check SDA/SCL connections
   4. Try adjusting brightness in code
```

---

## 📚 References

- ESP32 Datasheet: https://www.espressif.com/
- SSD1306 Guide: Adafruit repository
- MAX30100 Spec: https://datasheets.maxim.com/
- MPU6050 Guide: https://invensense.tdk.com/

---

## 📦 Shopping List

| Item | Qty | Price | Notes |
|------|-----|-------|-------|
| ESP32-WROOM-32 | 1 | $8-12 | DevKit version |
| SSD1306 OLED Display | 1 | $3-5 | 128x64 pixels |
| MAX30100/MAX30102 | 1 | $15-25 | GY-MAX30100 module |
| MPU6050 GY-521 | 1 | $3-5 | GY-521 module |
| Jumper Wires | 20+ | $2-3 | 40 pieces pack |
| Half-size Breadboard | 1 | $2-3 | For prototyping |
| Micro-USB Cable | 1 | $2-3 | For programming |
| **TOTAL** | | **$35-55** | Complete kit |

---

**Diagram saved to:** `docs/WIRING_DIAGRAM.md`

✅ Ready to build! Follow the steps above to connect all components.
