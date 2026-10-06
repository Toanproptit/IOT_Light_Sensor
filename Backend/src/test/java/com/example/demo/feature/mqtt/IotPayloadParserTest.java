package com.example.demo.feature.mqtt;

import org.junit.jupiter.api.Test;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;

class IotPayloadParserTest {
    private final IotPayloadParser parser = new IotPayloadParser();

    @Test
    void parsesSensorPayloadProducedByEsp32() {
        var result = parser.parseSensorPayload("Temp:28.5C | Hum:72.0% | LDR:1 | Light:TOI");
        assertThat(result.temperature()).isEqualTo(28.5);
        assertThat(result.humidity()).isEqualTo(72.0);
        assertThat(result.lightRaw()).isEqualTo(1);
        assertThat(result.dark()).isTrue();
    }

    @Test
    void parsesLedStatusProducedByEsp32() {
        var result = parser.parseStatusPayload("Red:ON | Yel:OFF | Gre:ON | Mode:MANUAL");
        assertThat(result.states()).containsEntry("LED_01", true)
                .containsEntry("LED_02", false)
                .containsEntry("LED_03", true);
        assertThat(result.mode()).isEqualTo("MANUAL");
    }

    @Test
    void rejectsNanDhtValues() {
        assertThatThrownBy(() -> parser.parseSensorPayload("Temp:nanC | Hum:72.0% | LDR:1 | Light:TOI"))
                .isInstanceOf(IllegalArgumentException.class);
    }
}
