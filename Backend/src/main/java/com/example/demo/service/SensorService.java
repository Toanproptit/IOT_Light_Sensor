package com.example.demo.service;

import com.example.demo.common.PagedResponse;
import com.example.demo.common.BusinessException;
import com.example.demo.common.HistoryTimeFilter;
import com.example.demo.dto.SensorDtos.RealtimeSensorDto;
import com.example.demo.dto.SensorDtos.RealtimeSensorsResponse;
import com.example.demo.dto.SensorDtos.SensorReadingDto;
import com.example.demo.enums.SensorStatus;
import com.example.demo.enums.SensorType;
import com.example.demo.feature.mqtt.MqttEvents.SensorSnapshot;
import com.example.demo.mapper.IotMapper;
import com.example.demo.model.Sensor;
import com.example.demo.model.SensorReading;
import com.example.demo.repository.SensorReadingRepository;
import com.example.demo.repository.SensorRepository;
import jakarta.persistence.criteria.Predicate;
import org.springframework.context.event.EventListener;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;
import org.springframework.http.HttpStatus;
import org.springframework.transaction.annotation.Transactional;

import java.time.OffsetDateTime;
import java.text.Normalizer;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;
import java.util.Locale;

@Service
public class SensorService {
    private final SensorReadingRepository repository;
    private final SensorRepository sensorRepository;
    private final IotMapper mapper;

    public SensorService(SensorReadingRepository repository, SensorRepository sensorRepository, IotMapper mapper) {
        this.repository = repository;
        this.sensorRepository = sensorRepository;
        this.mapper = mapper;
    }

    @EventListener
    @Transactional
    public void ingest(SensorSnapshot snapshot) {
        repository.saveAll(List.of(
                reading(SensorType.TEMPERATURE, snapshot.temperature(), temperatureStatus(snapshot.temperature()), snapshot.receivedAt()),
                reading(SensorType.HUMIDITY, snapshot.humidity(), humidityStatus(snapshot.humidity()), snapshot.receivedAt()),
                reading(SensorType.LIGHT, snapshot.lightRaw(), snapshot.dark() ? SensorStatus.LOW : SensorStatus.NORMAL, snapshot.receivedAt())
        ));
    }

    @Transactional(readOnly = true)
    public RealtimeSensorsResponse realtime() {
        List<RealtimeSensorDto> readings = Arrays.stream(SensorType.values())
                .map(type -> repository.findTopBySensor_TypeOrderByCreatedAtDesc(type).orElse(null))
                .filter(reading -> reading != null)
                .map(mapper::toRealtimeDto)
                .toList();
        return new RealtimeSensorsResponse(readings);
    }

    @Transactional(readOnly = true)
    public PagedResponse<SensorReadingDto> history(String search, String type, String status,
                                                    Double minValue, Double maxValue,
                                                    String timeQuery,
                                                    OffsetDateTime from, OffsetDateTime to,
                                                    int page, int limit, String direction) {
        return history(search, type, status, minValue, maxValue, timeQuery,
                from, to, page, limit, direction, null, null);
    }

    @Transactional(readOnly = true)
    public PagedResponse<SensorReadingDto> history(String search, String type, String status,
                                                    Double minValue, Double maxValue,
                                                    String timeQuery,
                                                    OffsetDateTime from, OffsetDateTime to,
                                                    int page, int limit, String direction,
                                                    String field, String value) {
        validateRange(minValue, maxValue, from, to);
        SensorType selectedType = parseType(type);
        SensorStatus selectedStatus = parseStatus(status);
        HistoryTimeFilter selectedTime = HistoryTimeFilter.parse(timeQuery);
        SensorFieldFilter fieldFilter = parseFieldFilter(field, value);

        Specification<SensorReading> specification = (root, query, cb) -> {
            List<Predicate> predicates = new ArrayList<>();
            if (search != null && !search.isBlank()) {
                String pattern = "%" + search.trim().toLowerCase() + "%";
                predicates.add(cb.or(
                        cb.like(cb.lower(root.get("sensor").get("sensorCode")), pattern),
                        cb.like(cb.lower(root.get("sensor").get("name")), pattern)
                ));
            }
            if (selectedType != null) predicates.add(cb.equal(root.get("sensor").get("type"), selectedType));
            if (selectedStatus != null) predicates.add(cb.equal(root.get("status"), selectedStatus));
            if (minValue != null) predicates.add(cb.greaterThanOrEqualTo(root.get("value"), minValue));
            if (maxValue != null) predicates.add(cb.lessThanOrEqualTo(root.get("value"), maxValue));
            if (selectedTime != null) predicates.add(selectedTime.toPredicate(cb, root.get("createdAt")));
            if (fieldFilter.allQuery() != null) {
                List<Predicate> matches = new ArrayList<>();
                String pattern = "%" + fieldFilter.allQuery().toLowerCase(Locale.ROOT) + "%";
                matches.add(cb.like(cb.lower(root.get("sensor").get("sensorCode")), pattern));
                matches.add(cb.like(cb.lower(root.get("sensor").get("name")), pattern));
                matches.add(cb.like(cb.lower(root.get("sensor").get("unit")), pattern));
                Double numericValue = parseNumber(fieldFilter.allQuery(), false);
                if (numericValue != null) matches.add(cb.equal(root.get("value"), numericValue));
                SensorType matchingType = findType(fieldFilter.allQuery());
                if (matchingType != null) matches.add(cb.equal(root.get("sensor").get("type"), matchingType));
                SensorStatus matchingStatus = findStatus(fieldFilter.allQuery());
                if (matchingStatus != null) matches.add(cb.equal(root.get("status"), matchingStatus));
                Long readingId = parseReadingId(fieldFilter.allQuery());
                if (readingId != null) matches.add(cb.equal(root.get("id"), readingId));
                predicates.add(cb.or(matches.toArray(Predicate[]::new)));
            }
            if (fieldFilter.type() != null) predicates.add(cb.equal(root.get("sensor").get("type"), fieldFilter.type()));
            if (fieldFilter.value() != null) predicates.add(cb.equal(root.get("value"), fieldFilter.value()));
            if (fieldFilter.time() != null) {
                predicates.add(fieldFilter.time().toPredicate(cb, root.get("createdAt")));
            }
            if (from != null) predicates.add(cb.greaterThanOrEqualTo(root.get("createdAt"), from));
            if (to != null) predicates.add(cb.lessThanOrEqualTo(root.get("createdAt"), to));
            return cb.and(predicates.toArray(Predicate[]::new));
        };
        Sort.Direction sortDirection = "asc".equalsIgnoreCase(direction)
                ? Sort.Direction.ASC : Sort.Direction.DESC;
        Sort sort = Sort.by(sortDirection, "createdAt").and(Sort.by(sortDirection, "id"));
        Page<SensorReadingDto> result = repository.findAll(specification,
                        PageRequest.of(Math.max(0, page - 1), Math.min(Math.max(limit, 1), 100), sort))
                .map(mapper::toSensorDto);
        return PagedResponse.from(result);
    }

    private SensorFieldFilter parseFieldFilter(String field, String value) {
        if ((field == null || field.isBlank()) && (value == null || value.isBlank())) {
            return new SensorFieldFilter(null, null, null, null);
        }

        String selectedField = field == null || field.isBlank() ? "all" : normalizeFilterKey(field);
        String selectedValue = value == null || value.isBlank() ? null : value.trim();
        return switch (selectedField) {
            case "all", "tatca" -> new SensorFieldFilter(selectedValue, null, null, null);
            case "temperature", "nhietdo" -> new SensorFieldFilter(
                    null, SensorType.TEMPERATURE, parseNumber(selectedValue, true), null);
            case "humidity", "doam" -> new SensorFieldFilter(
                    null, SensorType.HUMIDITY, parseNumber(selectedValue, true), null);
            case "light", "anhsang" -> new SensorFieldFilter(
                    null, SensorType.LIGHT, parseNumber(selectedValue, true), null);
            case "time", "thoigian" -> new SensorFieldFilter(
                    null, null, null, HistoryTimeFilter.parse(selectedValue));
            default -> throw new BusinessException(HttpStatus.BAD_REQUEST, "INVALID_SENSOR_FIELD",
                    "Trường tìm kiếm cảm biến không hợp lệ: " + field);
        };
    }

    private Double parseNumber(String value, boolean failWhenInvalid) {
        if (value == null || value.isBlank()) return null;
        try {
            return Double.valueOf(value.trim().replace(',', '.'));
        } catch (NumberFormatException exception) {
            if (!failWhenInvalid) return null;
            throw new BusinessException(HttpStatus.BAD_REQUEST, "INVALID_SENSOR_VALUE",
                    "Giá trị cảm biến phải là một số hợp lệ");
        }
    }

    private SensorType findType(String value) {
        String normalized = normalizeFilterKey(value);
        return Arrays.stream(SensorType.values())
                .filter(type -> normalizeFilterKey(type.value()).equals(normalized)
                        || normalizeFilterKey(type.label()).contains(normalized))
                .findFirst()
                .orElse(null);
    }

    private SensorStatus findStatus(String value) {
        String normalized = normalizeFilterKey(value);
        return Arrays.stream(SensorStatus.values())
                .filter(status -> normalizeFilterKey(status.value()).equals(normalized))
                .findFirst()
                .orElse(null);
    }

    private Long parseReadingId(String value) {
        String normalized = value.trim().replaceFirst("(?i)^SS-", "").replaceFirst("^#", "");
        try {
            return Long.valueOf(normalized);
        } catch (NumberFormatException exception) {
            return null;
        }
    }

    private String normalizeFilterKey(String value) {
        return Normalizer.normalize(value, Normalizer.Form.NFD)
                .replaceAll("\\p{M}", "")
                .toLowerCase(Locale.ROOT)
                .replaceAll("[\\s_-]+", "");
    }

    private record SensorFieldFilter(String allQuery, SensorType type, Double value,
                                     HistoryTimeFilter time) { }

    private void validateRange(Double minValue, Double maxValue, OffsetDateTime from, OffsetDateTime to) {
        if (minValue != null && maxValue != null && minValue > maxValue) {
            throw new BusinessException(HttpStatus.BAD_REQUEST, "INVALID_VALUE_RANGE",
                    "Giá trị từ không được lớn hơn giá trị đến");
        }
        if (from != null && to != null && from.isAfter(to)) {
            throw new BusinessException(HttpStatus.BAD_REQUEST, "INVALID_TIME_RANGE",
                    "Thời gian bắt đầu không được sau thời gian kết thúc");
        }
    }

    private SensorType parseType(String type) {
        if (type == null || type.isBlank()) return null;
        try {
            return SensorType.fromValue(type.trim());
        } catch (IllegalArgumentException exception) {
            throw new BusinessException(HttpStatus.BAD_REQUEST, "INVALID_SENSOR_TYPE", exception.getMessage());
        }
    }

    private SensorStatus parseStatus(String status) {
        if (status == null || status.isBlank()) return null;
        try {
            return SensorStatus.valueOf(status.trim().toUpperCase());
        } catch (IllegalArgumentException exception) {
            throw new BusinessException(HttpStatus.BAD_REQUEST, "INVALID_SENSOR_STATUS",
                    "Trạng thái cảm biến không hợp lệ: " + status);
        }
    }

    @Transactional(readOnly = true)
    public SensorReading latest(SensorType type) {
        return repository.findTopBySensor_TypeOrderByCreatedAtDesc(type).orElse(null);
    }

    private SensorReading reading(SensorType type, double value, SensorStatus status, OffsetDateTime time) {
        Sensor sensor = sensorRepository.findByType(type)
                .orElseGet(() -> sensorRepository.save(
                        new Sensor(type.sensorId(), type.label(), type, type.unit())));
        return new SensorReading(sensor, value, status, time);
    }

    private SensorStatus temperatureStatus(double value) {
        if (value < 18) return SensorStatus.LOW;
        if (value > 32) return SensorStatus.WARNING;
        return SensorStatus.NORMAL;
    }

    private SensorStatus humidityStatus(double value) {
        if (value < 40) return SensorStatus.LOW;
        if (value > 75) return SensorStatus.WARNING;
        return SensorStatus.NORMAL;
    }
}
