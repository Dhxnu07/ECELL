# Wiring Checklist & Verification

## Pre-Assembly Checklist

- [ ] Gather all components
- [ ] Check all components for damage
- [ ] Organize jumper wires by color
- [ ] Prepare breadboard on static-safe surface
- [ ] Have multimeter ready for testing

## Assembly Verification

### Phase 1: Power Supply

```
☐ ESP32 USB connected to computer
☐ 3.3V rail connected to 3.3V output
☐ GND rail connected to ground
☐ Voltage check: 3.3V between 3.3V and GND rails (use multimeter)
```

### Phase 2: I2C Bus

```
☐ GPIO 21 (SDA) connected to SDA rail
☐ GPIO 22 (SCL) connected to SCL rail
☐ All sensors SDA pins connected to SDA rail
☐ All sensors SCL pins connected to SCL rail
☐ Continuity check: SDA line unbroken (multimeter continuity)
☐ Continuity check: SCL line unbroken (multimeter continuity)
```

### Phase 3: OLED Display

```
☐ OLED VCC connected to 3.3V rail
☐ OLED GND connected to GND rail
☐ OLED SDA connected to GPIO 21
☐ OLED SCL connected to GPIO 22
☐ Voltage check: 3.3V at OLED VCC (multimeter)
☐ No shorts between pins
```

### Phase 4: MAX30100 Sensor

```
☐ MAX30100 VCC connected to 3.3V rail
☐ MAX30100 GND connected to GND rail
☐ MAX30100 SDA connected to GPIO 21
☐ MAX30100 SCL connected to GPIO 22
☐ MAX30100 INT connected to GPIO 35 (optional)
☐ Voltage check: 3.3V at MAX30100 VCC
☐ Sensor window is clean and unobstructed
```

### Phase 5: MPU6050 Sensor

```
☐ MPU6050 VCC connected to 3.3V rail
☐ MPU6050 GND connected to GND rail
☐ MPU6050 SDA connected to GPIO 21
☐ MPU6050 SCL connected to GPIO 22
☐ MPU6050 AD0 connected to GND (for I2C address 0x68)
☐ MPU6050 INT connected to GPIO 34 (optional)
☐ Voltage check: 3.3V at MPU6050 VCC
```

## I2C Device Detection

### Using Serial Monitor

```cpp
// Flash this code to verify I2C devices
#include <Wire.h>

void setup() {
  Wire.begin(21, 22);
  Serial.begin(115200);
  delay(1000);
  Serial.println("\nI2C Scanner Started");
  scanI2C();
}

void loop() {
  delay(5000);
  scanI2C();
}

void scanI2C() {
  int nDevices = 0;
  Serial.println("Scanning I2C Bus...");
  
  for (byte address = 1; address < 127; address++) {
    Wire.beginTransmission(address);
    byte error = Wire.endTransmission();
    
    if (error == 0) {
      Serial.print("✓ Device found at 0x");
      if (address < 16) Serial.print("0");
      Serial.println(address, HEX);
      nDevices++;
    }
  }
  
  Serial.print("Total devices: ");
  Serial.println(nDevices);
}
```

### Expected Output
```
I2C Scanner Started
Scanning I2C Bus...
✓ Device found at 0x3C    ← OLED Display
✓ Device found at 0x57    ← MAX30100 Sensor
✓ Device found at 0x68    ← MPU6050 IMU
Total devices: 3
```

## Voltage Measurements

### Using Multimeter (DC Voltage Mode)

```
Measurement Points:

1. 3.3V Rail to GND
   Expected: 3.3V
   Actual: ____V
   Status: ☐ Pass  ☐ Fail

2. OLED VCC to GND
   Expected: 3.3V
   Actual: ____V
   Status: ☐ Pass  ☐ Fail

3. MAX30100 VCC to GND
   Expected: 3.3V
   Actual: ____V
   Status: ☐ Pass  ☐ Fail

4. MPU6050 VCC to GND
   Expected: 3.3V
   Actual: ____V
   Status: ☐ Pass  ☐ Fail

5. SDA Line to GND
   Expected: 3.3V (pull-up)
   Actual: ____V
   Status: ☐ Pass  ☐ Fail

6. SCL Line to GND
   Expected: 3.3V (pull-up)
   Actual: ____V
   Status: ☐ Pass  ☐ Fail
```

## Continuity Tests

### Using Multimeter (Continuity Mode)

```
Connection Tests:

1. SDA Wire (GPIO 21 to all sensor SDA)
   ESP32 GPIO 21 ─→ Breadboard SDA rail ─→ OLED SDA
   Status: ☐ Continuous  ☐ Break
   
   Breadboard SDA rail ─→ MAX30100 SDA
   Status: ☐ Continuous  ☐ Break
   
   Breadboard SDA rail ─→ MPU6050 SDA
   Status: ☐ Continuous  ☐ Break

2. SCL Wire (GPIO 22 to all sensor SCL)
   ESP32 GPIO 22 ─→ Breadboard SCL rail ─→ OLED SCL
   Status: ☐ Continuous  ☐ Break
   
   Breadboard SCL rail ─→ MAX30100 SCL
   Status: ☐ Continuous  ☐ Break
   
   Breadboard SCL rail ─→ MPU6050 SCL
   Status: ☐ Continuous  ☐ Break

3. GND Connections
   ESP32 GND ─→ GND rail ─→ All GND connections
   Status: ☐ Continuous  ☐ Break

4. 3.3V Connections
   ESP32 3.3V ─→ 3.3V rail ─→ All VCC connections
   Status: ☐ Continuous  ☐ Break
```

## Resistance Checks (Optional Pull-ups)

```
I2C Pull-up Resistors (if manual installation needed):

SDA Pull-up Resistance:
Measure between 3.3V and SDA line (with device disconnected)
Expected: 4.7kΩ (built-in on most modules)
Actual: _____Ω
Status: ☐ Pass  ☐ Need to add 4.7kΩ resistor

SCL Pull-up Resistance:
Measure between 3.3V and SCL line (with device disconnected)
Expected: 4.7kΩ (built-in on most modules)
Actual: _____Ω
Status: ☐ Pass  ☐ Need to add 4.7kΩ resistor
```

## Visual Inspection

```
☐ No loose jumper wires
☐ No bent or damaged pins
☐ No cold solder joints (if soldered)
☐ No loose components
☐ Proper color coding of wires:
  - Red: 3.3V Power
  - Black: Ground (GND)
  - Blue/Green: I2C (SDA)
  - Yellow/Orange: I2C (SCL)
  - Other: Optional signals
☐ No visible corrosion on components
☐ No dust or debris on sensor windows
```

## Functional Tests

### Test 1: OLED Display
```
#include <Adafruit_SSD1306.h>
#include <Wire.h>

#define SCREEN_WIDTH 128
#define SCREEN_HEIGHT 64
#define OLED_ADDR 0x3C

Adafruit_SSD1306 display(SCREEN_WIDTH, SCREEN_HEIGHT, &Wire, -1);

void setup() {
  Serial.begin(115200);
  Wire.begin(21, 22);
  
  if (!display.begin(SSD1306_SWITCHCAPVCC, OLED_ADDR)) {
    Serial.println("OLED initialization failed");
  } else {
    display.clearDisplay();
    display.setTextSize(1);
    display.setTextColor(SSD1306_WHITE);
    display.setCursor(0, 0);
    display.println("OLED Working!");
    display.display();
    Serial.println("✓ OLED Test Passed");
  }
}

void loop() {}
```

Expected Result: "OLED Working!" displays on screen
Status: ☐ Pass  ☐ Fail

### Test 2: MAX30100 Sensor
```
// Verify sensor responds on I2C address 0x57
Serial.println("Checking MAX30100 at 0x57...");

Wire.beginTransmission(0x57);
if (Wire.endTransmission() == 0) {
  Serial.println("✓ MAX30100 Found");
} else {
  Serial.println("✗ MAX30100 Not Found");
}
```

Expected Result: "✓ MAX30100 Found"
Status: ☐ Pass  ☐ Fail

### Test 3: MPU6050 Sensor
```
// Verify sensor responds on I2C address 0x68
Serial.println("Checking MPU6050 at 0x68...");

Wire.beginTransmission(0x68);
if (Wire.endTransmission() == 0) {
  Serial.println("✓ MPU6050 Found");
} else {
  Serial.println("✗ MPU6050 Not Found");
}
```

Expected Result: "✓ MPU6050 Found"
Status: ☐ Pass  ☐ Fail

## Troubleshooting Quick Reference

| Problem | Likely Cause | Solution |
|---------|--------------|----------|
| No devices found on I2C | Wrong GPIO pins | Verify GPIO 21 (SDA), 22 (SCL) |
| Intermittent I2C errors | Loose connections | Re-seat all wires firmly |
| OLED shows nothing | Wrong I2C address | Check address 0x3C or 0x3D |
| Sensor not responding | Power issue | Check 3.3V voltage |
| Garbled display text | I2C speed too fast | Reduce clock speed to 100kHz |
| MPU6050 at wrong address | AD0 pin issue | Verify AD0 connected to GND |

## Final Verification Checklist

```
☐ All power voltages correct (3.3V)
☐ All I2C devices detected
☐ OLED display working
☐ MAX30100 responding
☐ MPU6050 responding
☐ No shorts or loose connections
☐ All wires securely connected
☐ Sensor windows clean
☐ No error messages in Serial Monitor
☐ Ready for firmware deployment
```

## Hardware Verification Summary

**Status:** ☐ All Tests Passed  ☐ Some Issues Found

Issues Found:
1. _________________________________
2. _________________________________
3. _________________________________

Notes:
_________________________________________
_________________________________________
_________________________________________

**Verified by:** ________________  **Date:** __________
