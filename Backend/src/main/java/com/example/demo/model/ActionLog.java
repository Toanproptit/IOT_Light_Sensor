package com.example.demo.model;

import com.example.demo.enums.CommandStatus;
import com.example.demo.enums.DeviceAction;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Index;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;

import java.time.OffsetDateTime;

@Entity
@Table(name = "actions", indexes = {
        @Index(name = "idx_action_created_at", columnList = "created_at")
})
public class ActionLog {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "device_id", nullable = false)
    private Device device;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "user_id", nullable = false)
    private UserProfile user;

    @Column(name = "command_id", nullable = false, unique = true, length = 80)
    private String commandId;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 30)
    private DeviceAction action;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 20)
    private CommandStatus status;

    @Column(name = "device_on", nullable = false)
    private boolean deviceOn;

    @Column(nullable = false)
    private int brightness;

    @Column(name = "created_at", nullable = false)
    private OffsetDateTime createdAt;

    protected ActionLog() { }

    public ActionLog(String commandId, Device device, UserProfile user,
                     DeviceAction action, CommandStatus status,
                     boolean deviceOn, int brightness, OffsetDateTime createdAt) {
        this.commandId = commandId;
        this.device = device;
        this.user = user;
        this.action = action;
        this.status = status;
        this.deviceOn = deviceOn;
        this.brightness = brightness;
        this.createdAt = createdAt;
    }

    public Long getId() { return id; }
    public Device getDevice() { return device; }
    public UserProfile getUser() { return user; }
    public String getCommandId() { return commandId; }
    public String getDeviceId() { return device.getDeviceCode(); }
    public String getDeviceName() { return device.getName(); }
    public DeviceAction getAction() { return action; }
    public CommandStatus getStatus() { return status; }
    public boolean isDeviceOn() { return deviceOn; }
    public int getBrightness() { return brightness; }
    public String getPerformedById() { return user.getUsername(); }
    public String getPerformedByName() { return user.getFullName(); }
    public OffsetDateTime getCreatedAt() { return createdAt; }
}
