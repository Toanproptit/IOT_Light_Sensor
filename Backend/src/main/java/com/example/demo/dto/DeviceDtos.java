package com.example.demo.dto;

import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;

import java.time.OffsetDateTime;
import java.util.List;

public final class DeviceDtos {
    private DeviceDtos() { }

    public record DeviceDto(
            String id, String name, String type, boolean isOn,
            int brightness, String connectionStatus, OffsetDateTime updatedAt
    ) { }

    public record DeviceControlRequest(
            @NotNull Boolean isOn,
            @Min(0) @Max(100) Integer brightness
    ) { }

    public record DeviceControlResponse(String commandId, String status, DeviceDto device) { }

    public record ControlAllRequest(@NotNull Boolean isOn) { }

    public record ControlAllResponse(int updatedDevices, List<String> failedDevices) { }
}
