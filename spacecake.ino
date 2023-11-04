void setup() {
  Serial.begin(115200);
  pinMode(13, INPUT_PULLUP);
  pinMode(12, INPUT_PULLUP);
  pinMode(11, INPUT_PULLUP);
  pinMode(10, INPUT_PULLUP);
}

uint8_t keys = 0;

void loop() {
  uint8_t new_keys = 0;
  if(!digitalRead(13)) new_keys |= 0b1 << 0;
  if(!digitalRead(12)) new_keys |= 0b1 << 1;
  if(!digitalRead(11)) new_keys |= 0b1 << 2;
  if(!digitalRead(10)) new_keys |= 0b1 << 3;

  if(new_keys != keys) {
    Serial.write(new_keys);
    keys = new_keys;
  }
}