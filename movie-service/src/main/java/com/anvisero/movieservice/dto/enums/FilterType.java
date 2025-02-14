package com.anvisero.movieservice.dto.enums;

public enum FilterType {
    EQ("EQ"),
    NE("NE"),
    GT("GT"),
    GTE("GTE"),
    LT("LT"),
    LTE("LTE"),
    SUBSTR("SUBSTR"),
    NSUBSTR("NSUBSTR");

    private final String value;

    FilterType(String value) {
        this.value = value;
    }

    @Override
    public String toString() {
        return String.valueOf(value);
    }

    public static FilterType fromValue(String text) {
        for (FilterType b : FilterType.values()) {
            if (String.valueOf(b.value).equals(text)) {
                return b;
            }
        }
        throw new IllegalArgumentException("Unexpected value '" + text + "'");
    }
}
