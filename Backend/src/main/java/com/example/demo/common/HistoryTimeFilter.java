package com.example.demo.common;

import jakarta.persistence.criteria.CriteriaBuilder;
import jakarta.persistence.criteria.Expression;
import jakarta.persistence.criteria.Predicate;
import org.springframework.http.HttpStatus;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.time.OffsetDateTime;
import java.time.format.DateTimeFormatter;
import java.time.format.DateTimeFormatterBuilder;
import java.time.format.DateTimeParseException;
import java.time.format.ResolverStyle;
import java.util.ArrayList;
import java.util.List;
import java.util.Locale;

public record HistoryTimeFilter(LocalDate date, LocalTime time, boolean matchSecond) {
    private static final DateTimeFormatter DATE = formatter("dd/MM/uuuu");
    private static final List<DateTimeFormatter> DATE_TIME_WITH_SECONDS = List.of(
            formatter("dd/MM/uuuu H:mm:ss"), formatter("dd/MM/uuuu h:mm:ss a")
    );
    private static final List<DateTimeFormatter> DATE_TIME_WITH_MINUTES = List.of(
            formatter("dd/MM/uuuu H:mm"), formatter("dd/MM/uuuu h:mm a")
    );
    private static final List<DateTimeFormatter> TIME_WITH_SECONDS = List.of(
            formatter("H:mm:ss"), formatter("h:mm:ss a")
    );
    private static final List<DateTimeFormatter> TIME_WITH_MINUTES = List.of(
            formatter("H:mm"), formatter("h:mm a")
    );

    public static HistoryTimeFilter parse(String value) {
        if (value == null || value.isBlank()) return null;
        String normalized = value.trim().replaceAll("\\s+", " ");

        for (DateTimeFormatter formatter : DATE_TIME_WITH_SECONDS) {
            LocalDateTime parsed = parseDateTime(normalized, formatter);
            if (parsed != null) return new HistoryTimeFilter(parsed.toLocalDate(), parsed.toLocalTime(), true);
        }
        for (DateTimeFormatter formatter : DATE_TIME_WITH_MINUTES) {
            LocalDateTime parsed = parseDateTime(normalized, formatter);
            if (parsed != null) return new HistoryTimeFilter(parsed.toLocalDate(), parsed.toLocalTime(), false);
        }
        try {
            return new HistoryTimeFilter(LocalDate.parse(normalized, DATE), null, false);
        } catch (DateTimeParseException ignored) {
            // Continue with time-only formats.
        }
        for (DateTimeFormatter formatter : TIME_WITH_SECONDS) {
            LocalTime parsed = parseTime(normalized, formatter);
            if (parsed != null) return new HistoryTimeFilter(null, parsed, true);
        }
        for (DateTimeFormatter formatter : TIME_WITH_MINUTES) {
            LocalTime parsed = parseTime(normalized, formatter);
            if (parsed != null) return new HistoryTimeFilter(null, parsed, false);
        }

        throw new BusinessException(HttpStatus.BAD_REQUEST, "INVALID_TIME_QUERY",
                "Thời gian không đúng định dạng. Dùng HH:mm, HH:mm:ss AM/PM hoặc DD/MM/YYYY HH:mm");
    }

    public Predicate toPredicate(CriteriaBuilder cb, Expression<OffsetDateTime> timestamp) {
        List<Predicate> predicates = new ArrayList<>();
        if (date != null) {
            predicates.add(cb.equal(cb.function("YEAR", Integer.class, timestamp), date.getYear()));
            predicates.add(cb.equal(cb.function("MONTH", Integer.class, timestamp), date.getMonthValue()));
            predicates.add(cb.equal(cb.function("DAY", Integer.class, timestamp), date.getDayOfMonth()));
        }
        if (time != null) {
            predicates.add(cb.equal(cb.function("HOUR", Integer.class, timestamp), time.getHour()));
            predicates.add(cb.equal(cb.function("MINUTE", Integer.class, timestamp), time.getMinute()));
            if (matchSecond) {
                predicates.add(cb.equal(cb.function("SECOND", Integer.class, timestamp), time.getSecond()));
            }
        }
        return cb.and(predicates.toArray(Predicate[]::new));
    }

    private static DateTimeFormatter formatter(String pattern) {
        return new DateTimeFormatterBuilder()
                .parseCaseInsensitive()
                .appendPattern(pattern)
                .toFormatter(Locale.ENGLISH)
                .withResolverStyle(ResolverStyle.STRICT);
    }

    private static LocalDateTime parseDateTime(String value, DateTimeFormatter formatter) {
        try {
            return LocalDateTime.parse(value, formatter);
        } catch (DateTimeParseException ignored) {
            return null;
        }
    }

    private static LocalTime parseTime(String value, DateTimeFormatter formatter) {
        try {
            return LocalTime.parse(value, formatter);
        } catch (DateTimeParseException ignored) {
            return null;
        }
    }
}
