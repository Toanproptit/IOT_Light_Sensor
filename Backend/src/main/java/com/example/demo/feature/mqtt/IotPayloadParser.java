package com.example.demo.feature.mqtt;

import com.example.demo.feature.mqtt.MqttEvents.DeviceSnapshot;
import com.example.demo.feature.mqtt.MqttEvents.SensorSnapshot;
import org.springframework.stereotype.Component;

import java.time.OffsetDateTime;
import java.util.LinkedHashMap;
import java.util.Locale;
import java.util.Map;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

@Component
public class IotPayloadParser {
    private static final Pattern SENSOR_PATTERN = Pattern.compile(
            "Temp:([+-]?(?:\\d+(?:\\.\\d+)?|nan))C\\s*\\|\\s*Hum:([+-]?(?:\\d+(?:\\.\\d+)?|nan))%\\s*\\|\\s*LDR:(\\d+)\\s*\\|\\s*Light:(TOI|SANG)",
            Pattern.CASE_INSENSITIVE);
    private static final Pattern STATUS_PATTERN = Pattern.compile(
            "Red:(ON|OFF)\\s*\\|\\s*Yel:(ON|OFF)\\s*\\|\\s*Gre:(ON|OFF)\\s*\\|\\s*Mode:(AUTO|MANUAL)",
            Pattern.CASE_INSENSITIVE);

    public SensorSnapshot parseSensorPayload(String payload) {
        Matcher matcher = SENSOR_PATTERN.matcher(payload.trim());
        if (!matcher.matches()) {
            throw new IllegalArgumentException("Payload cảm biến không đúng định dạng: " + payload);
        }
        double temperature = parseFinite(matcher.group(1), "temperature");
        double humidity = parseFinite(matcher.group(2), "humidity");
        int lightRaw = Integer.parseInt(matcher.group(3));
        boolean dark = "TOI".equalsIgnoreCase(matcher.group(4));
        return new SensorSnapshot(temperature, humidity, lightRaw, dark, OffsetDateTime.now());
    }

    public DeviceSnapshot parseStatusPayload(String payload) {
        Matcher matcher = STATUS_PATTERN.matcher(payload.trim());
        if (!matcher.matches()) {
            throw new IllegalArgumentException("Payload trạng thái không đúng định dạng: " + payload);
        }
        Map<String, Boolean> states = new LinkedHashMap<>();
        states.put("LED_01", "ON".equalsIgnoreCase(matcher.group(1)));
        states.put("LED_02", "ON".equalsIgnoreCase(matcher.group(2)));
        states.put("LED_03", "ON".equalsIgnoreCase(matcher.group(3)));
        return new DeviceSnapshot(states, matcher.group(4).toUpperCase(Locale.ROOT), OffsetDateTime.now());
    }

    private double parseFinite(String value, String field) {
        double parsed = Double.parseDouble(value);
        if (!Double.isFinite(parsed)) {
            throw new IllegalArgumentException("Giá trị " + field + " không hợp lệ");
        }
        return parsed;
    }
}
