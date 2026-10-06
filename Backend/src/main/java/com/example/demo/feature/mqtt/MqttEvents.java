package com.example.demo.feature.mqtt;

import java.time.OffsetDateTime;
import java.util.Map;

public final class MqttEvents {
    private MqttEvents() { }

    public record SensorSnapshot(
            double temperature,
            double humidity,
            int lightRaw,
            boolean dark,
            OffsetDateTime receivedAt
    ) { }

    public record DeviceSnapshot(
            Map<String, Boolean> states,
            String mode,
            OffsetDateTime receivedAt
    ) { }
}
