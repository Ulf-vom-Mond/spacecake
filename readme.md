# Spacecake

## Installation
### Node.js

You need to install Node.js with the following packets:
- serialport
- express

### Arduino

You have to flash spacecake.ino onto an Arduino Uno or Nano, for example with Arduino IDE. The Arduino has to be connected via USB to the computer and show up as serial port /dev/ttyUSB0.

### Hardware

Connect for push buttons between ground and pins 13, 12, 11 and 10 of the Arduino.

## How to run

After installing everything, run `node server.js` and open `localhost:3000` in your browser.