package com.anvisero.movieservice.dto.enums;

public enum SortingType {
    ASC("asc"),
    DESC("desc");

    private final String value;

    SortingType(String value) {
        this.value = value;
    }

    @Override
    public String toString() {
        return String.valueOf(value);
    }

    public static SortingType fromValue(String text) {
        for (SortingType b : SortingType.values()) {
            if (String.valueOf(b.value).equals(text)) {
                return b;
            }
        }
        throw new IllegalArgumentException("Unexpected value '" + text + "'");
    }
}
